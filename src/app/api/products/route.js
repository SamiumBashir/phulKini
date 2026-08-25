import { getProducts } from '@/server/products/getProducts';
import { createProduct } from '@/server/products/createProduct';
import { requireRole } from '@/lib/security/auth';
import { ProductCreateSchema } from '@/lib/validations/product';
import { withApiHandler, errorResponse, successResponse } from '@/lib/errors/apiHandler';

export const GET = withApiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const occasion = searchParams.get('occasion');
  const search = searchParams.get('search');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const inStockOnly = searchParams.get('inStock') === 'true';
  const sortBy = searchParams.get('sortBy') || 'popular';
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '50', 10));
  const skip = Math.max(0, parseInt(searchParams.get('skip') || '0', 10));

  const result = await getProducts({
    category,
    occasion,
    search,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
    limit,
    skip
  });

  return successResponse({
    ...result
  });
}, 'PRODUCTS_GET');

export const POST = withApiHandler(async (request, context, requestId) => {
  const session = await requireRole(request, ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EDITOR']);

  const body = await request.json();
  const validation = ProductCreateSchema.safeParse(body);

  if (!validation.success) {
    return errorResponse(
      validation.error.errors[0]?.message || 'ভুল পণ্য তথ্য প্রদান করা হয়েছে',
      400,
      requestId,
      validation.error.errors
    );
  }

  const product = await createProduct(validation.data, session);

  return successResponse(
    {
      product,
      message: 'পণ্যটি সফলভাবে যুক্ত হয়েছে! 🌸'
    },
    201
  );
}, 'PRODUCTS_CREATE');
