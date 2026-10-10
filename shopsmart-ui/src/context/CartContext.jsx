import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CartContext = createContext(null);

/**
 * Cart context skeleton. State shape matches CONTRACT section 5 GET /cart.
 * A2 completes the real implementation with API calls.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingEstimate, setShippingEstimate] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Skeleton functions – A2 fills these in
  const fetchCart = useCallback(async () => {}, []);
  const addItem = useCallback(async (productId, quantity) => {}, []);
  const updateItem = useCallback(async (productId, quantity) => {}, []);
  const removeItem = useCallback(async (productId) => {}, []);
  const clearCart = useCallback(() => {
    setItems([]);
    setSubtotal(0);
    setShippingEstimate(0);
    setTotal(0);
  }, []);

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
