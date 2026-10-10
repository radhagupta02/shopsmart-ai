import { get, post } from './client.js';

/**
 * POST /orders
 * Creates an order simulated from the user's cart.
 * Clears cart and returns order detail.
 * @returns {Promise<{
 *   id: string,
 *   status: string,
 *   total: number,
 *   createdAt: string,
 *   itemCount: number,
 *   shippingEstimate: number,
 *   items: Array<{productId: string, name: string, quantity: number, unitPrice: number}>,
 *   events: Array<{status: string, note: string, eventTime: string}>
 * }>}
 */
export function createOrder() {
  return post('/orders');
}

/**
 * GET /orders
 * Lists orders for the authenticated user.
 * @returns {Promise<Array<{
 *   id: string,
 *   status: string,
 *   total: number,
 *   createdAt: string,
 *   itemCount: number
 * }>>}
 */
export function listOrders() {
  return get('/orders');
}

/**
 * GET /orders/:id
 * Fetches order detail including items and status timeline events.
 * @param {string} id - order id (e.g. 'ORD-100001')
 * @returns {Promise<{
 *   id: string,
 *   status: string,
 *   total: number,
 *   createdAt: string,
 *   itemCount: number,
 *   shippingEstimate: number,
 *   items: Array<{productId: string, name: string, quantity: number, unitPrice: number}>,
 *   events: Array<{status: string, note: string, eventTime: string}>
 * }>}
 */
export function getOrder(id) {
  return get(`/orders/${id}`);
}
