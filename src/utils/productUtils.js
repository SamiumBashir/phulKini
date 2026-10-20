/**
 * Product & Inventory Utilities
 */

/**
 * Safely derives Schema.org item availability according to inventory rules:
 * 1. If numeric stock exists, stock > 0 => InStock, otherwise OutOfStock (even if inStock is true).
 * 2. If numeric stock is absent, use boolean inStock (true => InStock, false => OutOfStock).
 * 3. Fallback to product.isAvailable if defined.
 * 4. Otherwise, default to OutOfStock.
 *
 * @param {Object} product
 * @returns {string} Schema.org availability URI
 */
export function getProductAvailability(product) {
  if (!product) return 'https://schema.org/OutOfStock';

  // Rule 1: Numeric stock check
  if (typeof product.stock === 'number' && !Number.isNaN(product.stock)) {
    return product.stock > 0
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';
  }

  // Rule 2: Boolean inStock check (used by static catalog)
  if (typeof product.inStock === 'boolean') {
    return product.inStock
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';
  }

  // Rule 3: Database isAvailable flag fallback
  if (typeof product.isAvailable === 'boolean') {
    return product.isAvailable
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';
  }

  // Fallback policy
  return 'https://schema.org/OutOfStock';
}
