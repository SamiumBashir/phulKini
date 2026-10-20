import { PRODUCTS } from '@/data/products';
import { SITE_CONFIG } from '@/lib/config/siteConfig';
import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/models/Product';

export default async function sitemap() {
  const baseUrl = SITE_CONFIG.url;

  // 1. Static canonical routes (excluding private /order-confirmation)
  const staticRoutes = [
    '',
    '/shop',
    '/custom-bouquet',
    '/about',
    '/faq',
    '/contact',
    '/track-order'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' || route === '/shop' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/shop' || route === '/custom-bouquet' ? 0.9 : 0.7
  }));

  // 2. Database-Aware Product Slugs with deduplication and static fallback
  const productMap = new Map();

  // Try fetching published products from MongoDB
  try {
    const dbPromise = (async () => {
      await connectToDatabase();
      return await Product.find({ isAvailable: true })
        .select('slug updatedAt isAvailable')
        .lean();
    })();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Sitemap DB timeout')), 2000)
    );

    const dbProducts = await Promise.race([dbPromise, timeoutPromise]);

    if (Array.isArray(dbProducts) && dbProducts.length > 0) {
      for (const p of dbProducts) {
        if (p.slug && p.isAvailable !== false) {
          productMap.set(p.slug, {
            url: `${baseUrl}/product/${p.slug}`,
            lastModified: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
            changeFrequency: 'weekly',
            priority: 0.8
          });
        }
      }
    }
  } catch (error) {
    // Graceful fallback to static catalog on DB failure or timeout
  }

  // Populate or supplement with static products (ensures zero regression and deduplication)
  for (const staticProd of PRODUCTS) {
    if (staticProd.slug && !productMap.has(staticProd.slug)) {
      productMap.set(staticProd.slug, {
        url: `${baseUrl}/product/${staticProd.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8
      });
    }
  }

  const productRoutes = Array.from(productMap.values());

  return [...staticRoutes, ...productRoutes];
}

