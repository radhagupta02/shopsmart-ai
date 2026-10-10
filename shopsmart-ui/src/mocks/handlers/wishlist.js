import {
  getWishlistItems,
  addToWishlist,
  removeFromWishlist,
} from '../data/wishlist.js';
import { createMockError } from '../errors.js';

export function handleGetWishlist() {
  return getWishlistItems();
}

export function handleAddWishlist({ body }) {
  const { productId } = body || {};
  if (!productId) {
    throw createMockError('productId is required', 400, [
      { field: 'productId', message: 'productId is required' },
    ]);
  }
  return addToWishlist(productId);
}

export function handleDeleteWishlist({ params }) {
  const { productId } = params;
  removeFromWishlist(productId);
  // DELETE returns 204
  return null;
}
