import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import * as cartApi from '../api/cart.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingEstimate, setShippingEstimate] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const data = await cartApi.getCart();
      setItems(data.items || []);
      setSubtotal(data.subtotal || 0);
      setShippingEstimate(data.shippingEstimate || 0);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, toast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      clearCartState();
    }
  }, [isAuthenticated, fetchCart]);

  const clearCartState = useCallback(() => {
    setItems([]);
    setSubtotal(0);
    setShippingEstimate(0);
    setTotal(0);
  }, []);

  const clearCart = useCallback(async () => {
    // Usually clear cart involves multiple deletes or an explicit clear API,
    // but here we just clear local state. It's used after order placement.
    clearCartState();
  }, [clearCartState]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await cartApi.addCartItem(productId, quantity);
      toast.success('Added to cart');
      await fetchCart();
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    }
  }, [isAuthenticated, toast, fetchCart]);

  const updateItem = useCallback(async (productId, quantity) => {
    if (!isAuthenticated) return;
    try {
      // Optimistic update can be tricky with totals, so just load
      await cartApi.updateCartItem(productId, quantity);
      await fetchCart();
    } catch (err) {
      toast.error(err.message || 'Failed to update cart');
    }
  }, [isAuthenticated, toast, fetchCart]);

  const removeItem = useCallback(async (productId) => {
    if (!isAuthenticated) return;
    try {
      await cartApi.removeCartItem(productId);
      toast.success('Removed from cart');
      await fetchCart();
    } catch (err) {
      toast.error(err.message || 'Failed to remove from cart');
    }
  }, [isAuthenticated, toast, fetchCart]);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      subtotal,
      shippingEstimate,
      total,
      loading,
      itemCount,
      fetchCart,
      addItem,
      updateItem,
      removeItem,
      clearCart,
    }),
    [items, subtotal, shippingEstimate, total, loading, itemCount, fetchCart, addItem, updateItem, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
