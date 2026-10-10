import { get, post, del } from './client.js';

/**
 * GET /wishlist
 * @returns {Promise<Array>} - wishlist items
 */
export function getWishlist() {
  return get('/wishlist');
}

/**
 * POST /wishlist
 * @param {string} productId
 */
export function addWishlistItem(productId) {
  return post('/wishlist', { productId });
}

/**
 * DELETE /wishlist/:productId
 * @param {string} productId
 */
export function removeWishlistItem(productId) {
  return del(`/wishlist/${productId}`);
}
