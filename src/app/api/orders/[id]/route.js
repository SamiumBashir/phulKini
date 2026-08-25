import { getOrderById } from '@/server/orders/getOrderById';
import { getServerSession } from '@/lib/security/auth';
import { withApiHandler, errorResponse, successResponse } from '@/lib/errors/apiHandler';

export const GET = withApiHandler(async (request, { params }) => {
  const { id } = await params;
  const session = await getServerSession(request);

  const order = await getOrderById(id, session);

  if (!order) {
    return errorResponse('অর্ডারটি খুঁজে পাওয়া যায়নি', 404);
  }

  return successResponse({ order });
}, 'ORDER_DETAIL');
