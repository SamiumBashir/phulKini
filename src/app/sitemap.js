import { PRODUCTS } from '@/data/products';
import { SITE_CONFIG } from '@/lib/config/siteConfig';

export default async function sitemap() {
  const baseUrl = SITE_CONFIG.url;

  // Static routes
  const staticRoutes = [
    '',
    '/shop',
    '/custom-bouquet',
    '/about',
    '/faq',
    '/contact',
    '/track-order',
    '/order-confirmation'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' || route === '/shop' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/shop' || route === '/custom-bouquet' ? 0.9 : 0.7
  }));

  // Dynamic Product routes
  const productRoutes = PRODUCTS.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  return [...staticRoutes, ...productRoutes];
}
