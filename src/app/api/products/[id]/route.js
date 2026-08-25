import { getProductBySlug } from '@/server/products/getProductBySlug';
import { updateProduct } from '@/server/products/updateProduct';
import { deleteProduct } from '@/server/products/deleteProduct';
import { requireRole } from '@/lib/security/auth';
import { ProductUpdateSchema } from '@/lib/validations/product';
import { withApiHandler, errorResponse, successResponse } from '@/lib/errors/apiHandler';

export const GET = withApiHandler(async (request, { params }) => {
  const { id } = await params;
  const product = await getProductBySlug(id);

  if (!product) {
    return errorResponse('পণ্যটি খুঁজে পাওয়া যায়নি', 404);
  }

  return successResponse({ product });
}, 'PRODUCT_DETAIL');

export const PATCH = withApiHandler(async (request, { params }, requestId) => {
  const { id } = await params;
  const session = await requireRole(request, ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EDITOR']);

  const body = await request.json();
  const validation = ProductUpdateSchema.safeParse(body);

  if (!validation.success) {
    return errorResponse(
      validation.error.errors[0]?.message || 'ভুল তথ্য',
      400,
      requestId,
      validation.error.errors
    );
  }

  const updated = await updateProduct(id, validation.data, session);

  return successResponse({
    product: updated,
    message: 'পণ্য সফলভাবে আপডেট হয়েছে! 🌸'
  });
}, 'PRODUCT_UPDATE');

export const DELETE = withApiHandler(async (request, { params }) => {
  const { id } = await params;
  const session = await requireRole(request, ['SUPER_ADMIN', 'ADMIN']);

  await deleteProduct(id, session);

  return successResponse({
    message: 'পণ্য সফলভাবে মুছে ফেলা হয়েছে'
  });
}, 'PRODUCT_DELETE');
