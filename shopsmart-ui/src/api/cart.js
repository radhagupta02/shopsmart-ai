import { get, post, put, del } from './client.js';

/**
 * GET /cart
 * @returns {Promise<{items, subtotal, shippingEstimate, total}>}
 */
export function getCart() {
  return get('/cart');
}

/**
 * POST /cart/items
 * @param {string} productId
 * @param {number} quantity
 */
export function addCartItem(productId, quantity = 1) {
  return post('/cart/items', { productId, quantity });
}

/**
 * PUT /cart/items/:productId
 * @param {string} productId
 * @param {number} quantity
 */
export function updateCartItem(productId, quantity) {
  return put(`/cart/items/${productId}`, { quantity });
}

/**
 * DELETE /cart/items/:productId
 * @param {string} productId
 */
export function removeCartItem(productId) {
  return del(`/cart/items/${productId}`);
}
