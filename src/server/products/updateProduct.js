import connectToDatabase from '../../lib/db/mongodb.js';
import Product from '../../models/Product.js';
import { logAudit } from '../audit/logAudit.js';

export async function updateProduct(id, updateData, actor = null) {
  await connectToDatabase();

  const product = await Product.findByIdAndUpdate(
    id,
    { ...updateData },
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new Error('পণ্যটি খুঁজে পাওয়া যায়নি');
  }

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
