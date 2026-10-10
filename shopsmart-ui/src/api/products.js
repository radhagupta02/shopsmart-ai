import { get } from './client.js';

/**
 * GET /products
 * @param {Object} query - { q, category, brand, minPrice, maxPrice, minRating, inStock, sort, page, size }
 * @returns {Promise<{items, page, totalPages, totalItems}>}
 */
export function listProducts(query = {}) {
  return get('/products', query);
}

/**
 * GET /products/:id
 * @param {string} id - product id (e.g. 'LAP101')
 * @returns {Promise<Object>} - full product with specs and images
 */
export function getProduct(id) {
  return get(`/products/${id}`);
}

/**
 * GET /categories
 * @returns {Promise<Array>} - category tree [{id, name, children}]
 */
export function getCategories() {
  return get('/categories');
}
