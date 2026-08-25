import { signAuthToken, verifyAuthToken } from '../lib/security/jwt.js';
import { canTransitionOrder, canTransitionPayment, ORDER_STATUS, PAYMENT_STATUS } from '../server/orders/stateMachine.js';
import { calculateOrder } from '../server/orders/calculateOrder.js';
import { checkRateLimit } from '../lib/security/rateLimit.js';
import { OrderCreateSchema } from '../lib/validations/order.js';
import { LoginSchema } from '../lib/validations/auth.js';
import { ProductCreateSchema } from '../lib/validations/product.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runSecurityTests() {
  console.log('\n🔒 Starting Phul Kini Comprehensive Security & Integrity Test Suite...\n');

  // ==========================================
  // TEST SUITE 1: JWT AUTHENTICATION & INTEGRITY
  // ==========================================
  console.log('📦 [1/7] Testing JWT Cryptographic Integrity & Anti-Forgery...');
  const userPayload = {
    id: 'user_test_123',
    email: 'admin@phulkini.com',
    role: 'SUPER_ADMIN',
    name: 'Super Admin'
  };

  const validToken = await signAuthToken(userPayload);
  assert(typeof validToken === 'string' && validToken.split('.').length === 3, 'Valid JWT signature generated');

  const verified = await verifyAuthToken(validToken);
  assert(verified && verified.id === userPayload.id && verified.role === userPayload.role, 'Valid token verified with claims');

  // Forged Token Test (Tampered payload)
  const parts = validToken.split('.');
  const forgedPayload = Buffer.from(JSON.stringify({ ...userPayload, role: 'SUPER_ADMIN', id: 'hacked_id' })).toString('base64url');
  const forgedToken = `${parts[0]}.${forgedPayload}.${parts[2]}`;
  const forgedResult = await verifyAuthToken(forgedToken);
  assert(forgedResult === null, 'Forged JWT signature was strictly rejected');

  // Null & Empty Token Test
  assert((await verifyAuthToken(null)) === null, 'Null token safely rejected');
  assert((await verifyAuthToken('invalid.token.here')) === null, 'Malformed token safely rejected');

  // ==========================================
  // TEST SUITE 2: ORDER & PAYMENT STATE MACHINE
  // ==========================================
  console.log('\n📦 [2/7] Testing Order & Payment State Machine Transitions...');
  assert(canTransitionOrder(ORDER_STATUS.PENDING_PAYMENT, ORDER_STATUS.CONFIRMED), 'Transition PENDING_PAYMENT -> CONFIRMED is allowed');
  assert(canTransitionOrder(ORDER_STATUS.CONFIRMED, ORDER_STATUS.PROCESSING), 'Transition CONFIRMED -> PROCESSING is allowed');
  assert(canTransitionOrder(ORDER_STATUS.PROCESSING, ORDER_STATUS.READY_FOR_DELIVERY), 'Transition PROCESSING -> READY_FOR_DELIVERY is allowed');
  assert(canTransitionOrder(ORDER_STATUS.READY_FOR_DELIVERY, ORDER_STATUS.OUT_FOR_DELIVERY), 'Transition READY_FOR_DELIVERY -> OUT_FOR_DELIVERY is allowed');
  assert(canTransitionOrder(ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.DELIVERED), 'Transition OUT_FOR_DELIVERY -> DELIVERED is allowed');
  assert(canTransitionOrder(ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED), 'Transition PROCESSING -> CANCELLED is allowed');

  // Invalid transitions
  assert(!canTransitionOrder(ORDER_STATUS.DELIVERED, ORDER_STATUS.PROCESSING), 'Transition DELIVERED -> PROCESSING is strictly blocked');
  assert(!canTransitionOrder(ORDER_STATUS.CANCELLED, ORDER_STATUS.DELIVERED), 'Transition CANCELLED -> DELIVERED is strictly blocked');
  assert(!canTransitionOrder(ORDER_STATUS.REFUNDED, ORDER_STATUS.PROCESSING), 'Transition REFUNDED -> PROCESSING is strictly blocked');

  // Payment Transitions
  assert(canTransitionPayment(PAYMENT_STATUS.UNPAID, PAYMENT_STATUS.PAID), 'Payment UNPAID -> PAID allowed (COD)');
  assert(canTransitionPayment(PAYMENT_STATUS.PENDING, PAYMENT_STATUS.PAID), 'Payment PENDING -> PAID allowed');
  assert(!canTransitionPayment(PAYMENT_STATUS.REFUNDED, PAYMENT_STATUS.PAID), 'Payment REFUNDED -> PAID strictly blocked');

  // ==========================================
  // TEST SUITE 3: SERVER-SIDE PRICE CALCULATION & TAMPERING PREVENTION
  // ==========================================
  console.log('\n📦 [3/7] Testing Anti-Price Tampering & Custom Bouquet Math...');
  const customBouquetItem = {
    name: 'কাস্টম তোড়া',
    quantity: 1,
    price: 1, // Tampered client price: ৳1
    customBouquetConfig: {
      flowers: {
        'red-rose': 6, // 6 * 120 = 720
        'pink-rose': 6 // 6 * 130 = 780
      },
      sizeId: 'standard', // basePrice = 400
      wrappingId: 'burgundy-matte', // price = 150
      addOnIds: ['chocolates'] // price = 850
      // Total = 720 + 780 + 400 + 150 + 850 = 2900 BDT
    }
  };

  const calculated = await calculateOrder({
    items: [customBouquetItem],
    couponCode: null,
    deliveryZone: 'dhaka_inside'
  });

  assert(calculated.pricing.subtotal === 2900, `Server correctly calculated ৳2,900 (ignored client ৳1 tampering)`);
  assert(calculated.pricing.deliveryFee === 120, 'Server added standard delivery fee ৳120');
  assert(calculated.pricing.total === 3020, 'Server produced authoritative total ৳3,020');

  // Zone delivery fee calculation test
  const expressCalc = await calculateOrder({
    items: [customBouquetItem],
    deliveryZone: 'dhaka_express'
  });
  assert(expressCalc.pricing.deliveryFee === 250, 'Server applied express delivery fee ৳250');

  const midnightCalc = await calculateOrder({
    items: [customBouquetItem],
    deliveryZone: 'dhaka_midnight'
  });
  assert(midnightCalc.pricing.deliveryFee === 300, 'Server applied midnight delivery fee ৳300');

  // Free delivery threshold test (>= 5000 BDT)
  const largeCustomItem = {
    name: 'লাক্সারি মেগা কাস্টম তোড়া',
    quantity: 2,
    customBouquetConfig: {
      flowers: { 'red-rose': 20 },
      sizeId: 'grand',
      wrappingId: 'black-gold',
      addOnIds: ['chocolates', 'glass-vase']
    }
  };

  const largeCalc = await calculateOrder({
    items: [largeCustomItem],
    deliveryZone: 'dhaka_inside'
  });
  assert(largeCalc.pricing.deliveryFee === 0, 'Free delivery applied on order >= ৳5,000');
  assert(largeCalc.pricing.total === 10600, 'Exact grand total matches ৳10,600');

  // ==========================================
  // TEST SUITE 4: DISTRIBUTED RATE LIMITING
  // ==========================================
  console.log('\n📦 [4/7] Testing Distributed Rate Limiting Thresholds...');
  const testIp = `test_${Date.now()}`;
  const rl1 = await checkRateLimit(`login:${testIp}`, 3, 10);
  assert(rl1.allowed && rl1.remaining === 2, 'First request allowed with remaining quota');

  await checkRateLimit(`login:${testIp}`, 3, 10);
  await checkRateLimit(`login:${testIp}`, 3, 10);
  const rlBlocked = await checkRateLimit(`login:${testIp}`, 3, 10);
  assert(!rlBlocked.allowed && rlBlocked.remaining === 0, 'Excessive request blocked with 429 status');

  // ==========================================
  // TEST SUITE 5: ENVIRONMENT SECURITY & CONFIG
  // ==========================================
  console.log('\n📦 [5/7] Testing Environment Hardening & Simulation Restrictions...');
  const { ENV } = await import('../lib/config/env.js');
  assert(ENV.AUTH.SECRET && ENV.AUTH.SECRET.length >= 32, 'AUTH_SECRET has valid production-grade entropy (>= 32 chars)');
  assert(ENV.PAYMENTS.PAYMENT_SIMULATION === false || !ENV.IS_PRODUCTION, 'PAYMENT_SIMULATION strictly prohibited in production');

  // ==========================================
  // TEST SUITE 6: INPUT VALIDATION SCHEMAS (ZOD)
  // ==========================================
  console.log('\n📦 [6/7] Testing Input Validation & Injection Defense...');
  
  // Valid order payload
  const validOrderPayload = {
    items: [{ name: 'রোজ তোড়া', quantity: 1 }],
    delivery: {
      name: 'তানভীর আহমেদ',
      phone: '01712345678',
      address: 'হাউজ ১, রোড ২, বনানী, ঢাকা',
      date: '2026-08-26'
    },
    paymentMethod: 'cod'
  };
  const orderValid = OrderCreateSchema.safeParse(validOrderPayload);
  assert(orderValid.success, 'Valid order payload accepted by Zod schema');

  // Invalid order payload (negative quantity, short phone)
  const invalidOrderPayload = {
    items: [{ name: 'রোজ তোড়া', quantity: -5 }],
    delivery: {
      name: 'A',
      phone: '123',
      address: 'Dhaka',
      date: '2026-08-26'
    }
  };
  const orderInvalid = OrderCreateSchema.safeParse(invalidOrderPayload);
  assert(!orderInvalid.success, 'Negative quantity and invalid phone strictly rejected by Zod schema');

  // Login Validation
  const validLogin = LoginSchema.safeParse({ email: 'admin@phulkini.com', password: 'password123' });
  const invalidLogin = LoginSchema.safeParse({ email: 'not-an-email', password: '123' });
  assert(validLogin.success && !invalidLogin.success, 'Email and password validation schema enforced');

  // Product validation (reject negative price)
  const invalidProduct = ProductCreateSchema.safeParse({
    name: 'গোলাপ',
    category: 'bouquets',
    price: -500,
    images: ['https://example.com/img.jpg']
  });
  assert(!invalidProduct.success, 'Negative product price rejected by schema');

  // ==========================================
  // TEST SUITE 7: PAYMENT SPOOFING & INTEGRITY
  // ==========================================
  console.log('\n📦 [7/7] Testing Payment Spoofing Prevention...');
  const { validateSSLCommerzTransaction } = await import('../server/payments/sslcommerz.js');
  
  // Missing parameters rejection
  const missingParamsResult = await validateSSLCommerzTransaction({ valId: null, tranId: null });
  assert(!missingParamsResult.valid, 'Missing transaction params rejected');

  const invalidOrderResult = await validateSSLCommerzTransaction({ valId: 'val_123', tranId: 'NON_EXISTENT_ORDER' });
  assert(!invalidOrderResult.valid, 'Non-existent order verification rejected');

  console.log('\n' + '='.repeat(50));
  console.log(`🎯 Test Results Summary: ${passed} Passed, ${failed} Failed`);
  console.log('='.repeat(50) + '\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Test suite fatal error:', err);
    process.exit(1);
  });
