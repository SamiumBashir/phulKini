import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { logAudit } from '@/server/audit/logAudit';

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
      metadata: { name: product.name, price: product.price }
    });
  }

  return product;
}
