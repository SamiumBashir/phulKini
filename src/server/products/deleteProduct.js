import connectToDatabase from '../../lib/db/mongodb.js';
import Product from '../../models/Product.js';
import { logAudit } from '../audit/logAudit.js';

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
      resourceId: id.toString(),
      metadata: { name: product.name }
    });
  }

  return product;
}
