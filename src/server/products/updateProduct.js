import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { logAudit } from '@/server/audit/logAudit';

export async function updateProduct(id, updateData, actor = null) {
  await connectToDatabase();

  const product = await Product.findById(id);
  if (!product) {
    throw new Error('পণ্যটি খুঁজে পাওয়া যায়নি');
  }

  Object.assign(product, updateData);
  await product.save();

  if (actor) {
    await logAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'UPDATE_PRODUCT',
      resource: 'PRODUCT',
      resourceId: product._id.toString(),
      metadata: { name: product.name, updateFields: Object.keys(updateData) }
    });
  }

  return product;
}
