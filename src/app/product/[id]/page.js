import React from 'react';
import ProductDetailPageView from '@/components/shop/ProductDetailPageView';
import { getProductBySlug } from '@/server/products/getProductBySlug';
import { PRODUCTS } from '@/data/products';
import { SITE_CONFIG } from '@/lib/config/siteConfig';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = (await getProductBySlug(resolvedParams.id)) ||
    PRODUCTS.find((p) => p.slug === resolvedParams.id || p.id === resolvedParams.id) ||
    PRODUCTS[0];

  return {
    title: `${product.name} | ${SITE_CONFIG.name}`,
    description: product.shortDescription || product.description,
    openGraph: {
      title: `${product.name} — ${product.categoryName}`,
      description: product.shortDescription || product.description,
      images: [
        {
          url: product.images && product.images[0] ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url) : '/og-image.jpg',
          width: 800,
          height: 800,
          alt: product.name
        }
      ]
    }
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const product = (await getProductBySlug(resolvedParams.id)) ||
    PRODUCTS.find((p) => p.slug === resolvedParams.id || p.id === resolvedParams.id);

  const productUrl = `${SITE_CONFIG.url}/product/${product?.slug || resolvedParams.id}`;
  const imageUrl = product?.images && product.images[0] 
    ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url) 
    : '';

  // JSON-LD structured data for search engine rich results
  const structuredData = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: imageUrl ? [imageUrl] : [],
    description: product.shortDescription || product.description,
    sku: `PK-${product.slug}`,
    brand: {
      '@type': 'Brand',
      name: 'ফুল কিনি (Phul Kini)'
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'BDT',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'ফুল কিনি (Phul Kini)'
      }
    }
  } : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <ProductDetailPageView productId={resolvedParams.id} />
    </>
  );
}
