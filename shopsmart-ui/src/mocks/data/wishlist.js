import { PRODUCTS, toCatalogItem } from './products.js';

/**
 * In-memory wishlist product IDs for mock mode.
 * Seeded with LAP102 and AUD301.
 */
let mockWishlistIds = ['LAP102', 'AUD301'];

export function getWishlistItems() {
  return mockWishlistIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean)
    .map(toCatalogItem);
}

export function addToWishlist(productId) {
  if (productId && !mockWishlistIds.includes(productId)) {
    mockWishlistIds.push(productId);
  }
  return getWishlistItems();
}

export function removeFromWishlist(productId) {
  mockWishlistIds = mockWishlistIds.filter((id) => id !== productId);
  return getWishlistItems();
}
