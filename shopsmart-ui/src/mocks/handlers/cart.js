import {
  getCartState,
  addToCart,
  updateCartQuantity,
  removeCartItemById,
} from '../data/cart.js';
import { findUserByToken } from '../data/users.js';
import { createMockError } from '../errors.js';

export function handleGetCart({ token }) {
  const user = findUserByToken(token);
  return getCartState(user?.tier);
}

export function handleAddCartItem({ body, token }) {
  const { productId, quantity = 1 } = body || {};
  if (!productId) {
    throw createMockError('productId is required', 400, [
      { field: 'productId', message: 'productId is required' },
    ]);
  }

  const user = findUserByToken(token);
  try {
    return addToCart(productId, Number(quantity) || 1, user?.tier);
  } catch (err) {
    if (err.status === 409) {
      throw createMockError(err.message, 409);
    }
    throw err;
  }
}

export function handleUpdateCartItem({ params, body, token }) {
  const { id: productId } = params;
  const { quantity } = body || {};
  if (quantity === undefined || quantity === null) {
    throw createMockError('quantity is required', 400, [
      { field: 'quantity', message: 'quantity is required' },
    ]);
  }

  const user = findUserByToken(token);
  return updateCartQuantity(productId, Number(quantity), user?.tier);
}

export function handleDeleteCartItem({ params, token }) {
  const { id: productId } = params;
  const user = findUserByToken(token);
  removeCartItemById(productId, user?.tier);
  // DELETE returns 204 No Content (null)
  return null;
}
