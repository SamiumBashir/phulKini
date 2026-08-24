import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { logAudit } from '@/server/audit/logAudit';

export async function deleteProduct(id, actor = null) {
  await connectToDatabase();

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new Error('পণ্যটি খুঁজে পাওয়া যায়নি');
  }

  if (actor) {
    await logAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'DELETE_PRODUCT',
      resource: 'PRODUCT',
      resourceId: id,
      metadata: { name: product.name }
    });
  }

  return true;
}
