import { trackOrder } from '@/server/orders/trackOrder';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { withApiHandler, errorResponse, successResponse } from '@/lib/errors/apiHandler';

export const POST = withApiHandler(async (request, context, requestId) => {
  const ip = getClientIp(request);

  // Rate limit: 20 tracking queries per minute per IP
  const rateLimit = await checkRateLimit(`order_track:${ip}`, 20, 60);
  if (!rateLimit.allowed) {
    return errorResponse(
      'অতিরিক্ত ট্র্যাকিং অনুরোধ! অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।',
      429,
      requestId
    );
  }

  const body = await request.json();
  const { orderNumber, phone } = body;

  if (!orderNumber || !phone) {
    return errorResponse('অর্ডার নম্বর এবং মোবাইল নম্বর উভয়ই প্রয়োজন', 400, requestId);
  }

  const order = await trackOrder({ orderNumber, phone });

  if (!order) {
    return errorResponse('উক্ত অর্ডার নম্বর বা ফোন নম্বরের কোনো অর্ডার খুঁজে পাওয়া যায়নি।', 404, requestId);
  }

  return successResponse({ order });
}, 'ORDER_TRACK');
