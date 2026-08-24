import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { PRODUCTS as FALLBACK_PRODUCTS } from '@/data/products';
import mongoose from 'mongoose';

export async function getProductBySlug(slugOrId) {
  try {
    await connectToDatabase();

    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);
    const query = isObjectId
      ? { $or: [{ _id: slugOrId }, { slug: slugOrId }] }
      : { slug: slugOrId };

    const product = await Product.findOne(query).lean();
    if (product) {
      return {
        ...product,
        id: product._id.toString()
      };
    }
  } catch (e) {}

  // Fallback lookup
  return FALLBACK_PRODUCTS.find((p) => p.slug === slugOrId || p.id === slugOrId) || null;
}
