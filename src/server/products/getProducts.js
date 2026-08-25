import connectToDatabase from '../../lib/db/mongodb.js';
import Product from '../../models/Product.js';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../../data/products.js';
import cache from '../../lib/redis/redis.js';

export async function getProducts({
  category = null,
  occasion = null,
  search = null,
  minPrice = null,
  maxPrice = null,
  inStockOnly = false,
  sortBy = 'popular',
  limit = 50,
  skip = 0
} = {}) {
  try {
    await connectToDatabase();

    const query = { isAvailable: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (occasion && occasion !== 'all') {
      query.occasions = occasion;
    }

    if (inStockOnly) {
      query.stock = { $gt: 0 };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { englishName: regex },
        { categoryName: regex },
        { shortDescription: regex },
        { tags: regex }
      ];
    }

    let sort = { isBestseller: -1, createdAt: -1 };
    if (sortBy === 'price-low') sort = { price: 1 };
    if (sortBy === 'price-high') sort = { price: -1 };
    if (sortBy === 'rating') sort = { rating: -1 };
    if (sortBy === 'new') sort = { createdAt: -1 };

    const cacheKey = `products:${JSON.stringify({ category, occasion, search, minPrice, maxPrice, inStockOnly, sortBy, limit, skip })}`;
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const [products, totalCount] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(query)
    ]);

    // Initial fallback if database is not yet seeded
    if (products.length === 0 && !search && !category && !occasion) {
      return {
        products: FALLBACK_PRODUCTS,
        total: FALLBACK_PRODUCTS.length,
        fromFallback: true
      };
    }

    const result = {
      products: products.map((p) => ({
        ...p,
        id: p._id.toString()
      })),
      total: totalCount,
      fromFallback: false
    };

    await cache.set(cacheKey, result, 120); // 2 minutes cache
    return result;
  } catch (error) {
    console.warn('⚠️ Database fetch fallback:', error.message);
    return {
      products: FALLBACK_PRODUCTS,
      total: FALLBACK_PRODUCTS.length,
      fromFallback: true
    };
  }
}
