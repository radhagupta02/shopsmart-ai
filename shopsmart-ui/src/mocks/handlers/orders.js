import {
  listUserOrders,
  getOrderById,
  createOrderFromCart,
} from '../data/orders.js';
import { getCartState, clearCart } from '../data/cart.js';
import { findUserByToken } from '../data/users.js';
import { createMockError } from '../errors.js';

export function handleListOrders({ token }) {
  const user = findUserByToken(token);
  return listUserOrders(user?.id);
}

export function handleGetOrder({ params }) {
  const { id } = params;
  const order = getOrderById(id);
  if (!order) {
    throw createMockError(`Order ${id} not found`, 404);
  }
  return order;
}

export function handleCreateOrder({ token }) {
  const user = findUserByToken(token);
  const cartState = getCartState(user?.tier);

  if (!cartState.items || cartState.items.length === 0) {
    throw createMockError('Cannot checkout with an empty cart', 409);
  }

  const newOrder = createOrderFromCart(cartState, user);
  clearCart();
  return newOrder;
}
