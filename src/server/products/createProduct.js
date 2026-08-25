import connectToDatabase from '../../lib/db/mongodb.js';
import Product from '../../models/Product.js';
import { logAudit } from '../audit/logAudit.js';

export async function createProduct(productData, actor = null) {
  await connectToDatabase();

  const slug =
    productData.slug ||
    (productData.englishName || productData.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') ||
    `flower-${Date.now()}`;

  // Ensure unique slug
  let uniqueSlug = slug;
  let count = 1;
  while (await Product.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${slug}-${count++}`;
  }

  const product = await Product.create({
    ...productData,
    slug: uniqueSlug
  });

  if (actor) {
    await logAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'CREATE_PRODUCT',
      resource: 'PRODUCT',
      resourceId: product._id.toString(),
      metadata: { name: product.name, price: product.price, stock: product.stock }
    });
  }

  return product;
}
