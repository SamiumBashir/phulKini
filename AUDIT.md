# PHUL KINI v2 — COMPREHENSIVE ARCHITECTURE & SECURITY AUDIT

**Target**: ফুল কিনি (Phul Kini) Production E-Commerce Upgrade  
**Repository**: [https://github.com/SamiumBashir/phulKini](https://github.com/SamiumBashir/phulKini)  
**Date**: August 25, 2026  
**Auditor**: Senior Full-Stack Architect & Security Engineer  

---

## 1. Executive Summary

The existing Phul Kini codebase provides an exceptional, luxury Bangladeshi floral boutique UI/UX built with **Next.js 15 App Router, React 19, and Tailwind CSS**. It contains comprehensive Bengali typography, responsive storefront components, an 8-step custom bouquet builder, cart drawer, checkout interface, order tracking timeline, and an initial CMS UI.

However, the current prototype relies heavily on **client-side storage (`localStorage`/`sessionStorage`), unauthenticated client actions, static data files, and insecure mock authentication**.

This audit identifies all vulnerabilities, outlines the structural refactoring required, and defines a zero-regression migration roadmap to turn Phul Kini into a **hardened, production-ready, database-backed e-commerce system** while 100% preserving the existing visual identity.

---

## 2. Security Vulnerabilities & Prototype Weaknesses

### 🚨 Critical Vulnerability 1: Insecure Client-Side Admin Authentication
- **Current State**: `/admin` uses `sessionStorage.getItem('phulkini_admin_auth')` and hardcoded client check `if (passcode === 'admin123')`.
- **Risk**: Any user can bypass login by simply opening browser devtools and running `sessionStorage.setItem('phulkini_admin_auth', 'true')` or viewing the passcode in JavaScript bundles.
- **Remediation**: 
  - Remove all client-side authentication logic.
  - Implement real server-side authentication (`POST /api/auth/login`) with `bcryptjs` password hashing, `jose` signed JWT session tokens stored in `HttpOnly; Secure; SameSite=Lax` cookies.
  - Enforce RBAC (`SUPER_ADMIN`, `ADMIN`, `MANAGER`, `EDITOR`, `CUSTOMER`) via Next.js `middleware.js` and server DAL guards.

### 🚨 Critical Vulnerability 2: Client-Side Price & Coupon Trust
- **Current State**: `CartContext` and `CheckoutView` calculate subtotals, coupon discounts, and grand totals purely in the browser.
- **Risk**: A malicious user can intercept network requests, alter product prices (e.g. ৳3,500 -> ৳1), forge discounts, or fake successful payments.
- **Remediation**:
  - Move all price calculation, stock verification, and coupon validation to the server Data Access Layer (`src/server/orders/`, `src/server/coupons/`).
  - The client will only send `[{ productId, quantity }]` and `couponCode`. The server fetches true prices from MongoDB and computes the definitive total.

### 🚨 Critical Vulnerability 3: Media Upload Security
- **Current State**: `CloudinaryUploader.js` uses an unsigned upload preset directly from the client.
- **Risk**: Attackers can upload unauthorized files, malware, or overwhelm the Cloudinary storage quota.
- **Remediation**:
  - Implement server-side signed Cloudinary upload endpoint (`POST /api/uploads/sign`) that verifies user authentication, checks file types (JPG, PNG, WEBP), and enforces a 5MB size limit. Never expose `CLOUDINARY_API_SECRET` to the client.

### 🚨 Critical Vulnerability 4: Lack of Database Persistence & Atomic Inventory
- **Current State**: New products, edits, and orders are saved only to `localStorage`.
- **Risk**: Products and orders are tied to a single user's browser, orders cannot be processed by store staff, and stock overselling cannot be prevented.
- **Remediation**:
  - Connect to **MongoDB Atlas** (`phul_kini` database) with Mongoose schemas for `User`, `Product`, `Category`, `Order`, `Coupon`, `Review`, and `AuditLog`.
  - Use atomic database operations (`$inc: { stock: -qty }` with `{ stock: { $gte: qty } }`) to guarantee zero overselling.

### 🚨 Critical Vulnerability 5: Missing Payment Verification (SSLCOMMERZ)
- **Current State**: Checkout uses a timeout and generates a simulated order ID.
- **Remediation**:
  - Integrate **SSLCOMMERZ** gateway with server-side session initialization (`POST /api/payments/sslcommerz/init`), secure IPN (Instant Payment Notification) listener, and cryptographic validation before marking orders as `PAID`. Support Cash on Delivery (COD) with `UNPAID` initial state.

---

## 3. Inventory of Files: Keep, Modify, and Create

### A. Files to KEEP (Preserve 100% Visuals & Layout)
- `src/components/home/HeroSection.js`
- `src/components/home/CategorySection.js`
- `src/components/home/OccasionGrid.js`
- `src/components/home/CustomBouquetBanner.js`
- `src/components/home/ExperienceSection.js`
- `src/components/home/TestimonialsSection.js`
- `src/components/home/NewsletterSection.js`
- `src/components/common/RatingStars.js`
- `src/components/common/ToastContainer.js`
- `src/components/common/MobileBottomNav.js`
- `src/components/builder/CustomBouquetBuilder.js`
- `src/data/builderOptions.js`, `src/data/occasions.js`, `src/data/testimonials.js`
- `src/utils/bengaliUtils.js`

### B. Files to MODIFY
- `package.json`: Add `mongoose`, `bcryptjs`, `jose`, `zod`, `ioredis`, `cloudinary`, `cookie`.
- `src/app/layout.js`: Add Security headers, AuthProvider, and clean hydration.
- `src/components/common/Navbar.js`: Connect user profile state, search endpoint, and cart drawer.
- `src/components/common/Footer.js`: Ensure clean boutique links and customer support.
- `src/components/shop/ShopCatalogView.js`: Fetch products from MongoDB API with caching and fallback.
- `src/components/shop/ProductDetailPageView.js`: Load product data from database with SEO metadata.
- `src/components/home/FeaturedBouquets.js`: Display database-backed featured bouquets.
- `src/components/cart/CartDrawer.js` & `CartView.js`: Support guest cart (localStorage) and authenticated cart.
- `src/components/checkout/CheckoutView.js`: Call `POST /api/orders` and redirect to SSLCOMMERZ gateway or COD confirmation.
- `src/components/order/OrderConfirmationView.js`: Fetch verified order details from `/api/orders/[id]`.
- `src/components/admin/AdminDashboard.js`: Connect to real database metrics, orders management, and product CRUD.
- `src/components/admin/AdminLogin.js`: Call `POST /api/auth/login` and set secure HttpOnly cookie.
- `src/components/admin/ProductFormModal.js`: Submit to `/api/products` (POST/PATCH) with signed Cloudinary images.
- `src/components/admin/CloudinaryUploader.js`: Use signed upload parameters from `/api/uploads/sign`.

### C. Files to CREATE (New Backend & Architecture)
- **Database & Connections**:
  - `src/lib/db/mongodb.js` (Mongoose connection cache for serverless)
  - `src/lib/redis/redis.js` (Redis client with in-memory fallback for rate limiting & cache)
- **Database Models (`src/models/`)**:
  - `User.js`, `Product.js`, `Category.js`, `Order.js`, `Coupon.js`, `Review.js`, `AuditLog.js`
- **Validation Schemas (`src/lib/validations/`)**:
  - `auth.js`, `product.js`, `order.js`, `coupon.js`, `review.js`
- **Data Access Layer (`src/server/`)**:
  - `src/server/auth/`: `authenticateUser.js`, `createSession.js`, `verifySession.js`
  - `src/server/products/`: `getProducts.js`, `getProductBySlug.js`, `createProduct.js`, `updateProduct.js`, `deleteProduct.js`
  - `src/server/orders/`: `createOrder.js`, `getOrderById.js`, `getOrders.js`, `updateOrderStatus.js`, `calculateOrder.js`
  - `src/server/coupons/`: `validateCoupon.js`, `applyCoupon.js`
  - `src/server/payments/`: `sslcommerz.js`
  - `src/server/audit/`: `logAudit.js`
- **API Endpoints (`src/app/api/`)**:
  - `auth/login/route.js`, `auth/logout/route.js`, `auth/me/route.js`
  - `products/route.js`, `products/[id]/route.js`
  - `categories/route.js`
  - `orders/route.js`, `orders/[id]/route.js`, `orders/[id]/status/route.js`, `orders/track/route.js`
  - `coupons/validate/route.js`
  - `payments/sslcommerz/init/route.js`, `payments/sslcommerz/callback/route.js`, `payments/sslcommerz/ipn/route.js`
  - `uploads/sign/route.js`
  - `admin/analytics/route.js`
- **Security & Middleware**:
  - `middleware.js` (Route protection for `/admin/*` and protected APIs)
  - `src/lib/security/rateLimit.js`
- **Customer Pages**:
  - `src/app/track-order/page.js`
  - `src/app/order/[orderId]/page.js`
- **Seed Scripts**:
  - `src/scripts/seed.js` (Seeds initial products, categories, coupons, and super admin user)

---

## 4. Phase-by-Phase Execution Plan

1. **Phase 1: Audit & Specification** (Complete in `AUDIT.md` and `implementation_plan.md`)
2. **Phase 2: Dependencies & Database Layer** (Mongoose connection, 7 Models, Seed script)
3. **Phase 3: Security, Password Hashing & Authentication** (JWT, HttpOnly cookie, RBAC, Middleware)
4. **Phase 4: Data Access Layer & Product API** (Zod validation, Products & Categories endpoints)
5. **Phase 5: Cloudinary Server-Side Signed Uploads** (Upload signature, MIME verification)
6. **Phase 6: Orders, Inventory & Coupon Engine** (Atomic stock decrements, server price calculation)
7. **Phase 7: SSLCOMMERZ Payment Integration & Cash on Delivery** (Init, IPN, server verification)
8. **Phase 8: Admin CMS & Analytics Dashboard** (Connect real DB to Products, Orders, Coupons, Audit logs)
9. **Phase 9: Storefront & Customer Experience** (Connect live shop, details, track-order page)
10. **Phase 10: Testing, Verification & GitHub History Commit** (Zero build errors, historical commits)
