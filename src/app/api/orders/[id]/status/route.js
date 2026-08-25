import { updateOrderStatus } from '@/server/orders/updateOrderStatus';
import { requireRole } from '@/lib/security/auth';
import { withApiHandler, errorResponse, successResponse } from '@/lib/errors/apiHandler';

export const PATCH = withApiHandler(async (request, { params }, requestId) => {
  const { id } = await params;
  const session = await requireRole(request, ['SUPER_ADMIN', 'ADMIN', 'MANAGER']);

  const body = await request.json();
  const { status, note } = body;

  if (!status) {
    return errorResponse('স্ট্যাটাস আবশ্যক', 400, requestId);
  }

  const updated = await updateOrderStatus({
    orderId: id,
    newStatus: status,
    note,
    actor: session,
    requestId
  });

  return successResponse({
    order: updated,
    message: 'অর্ডার স্ট্যাটাস সফলভাবে আপডেট হয়েছে'
  });
}, 'ORDER_STATUS_UPDATE');
