import { SITE_CONFIG } from '@/lib/config/siteConfig';

export default function robots() {
  const baseUrl = SITE_CONFIG.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
