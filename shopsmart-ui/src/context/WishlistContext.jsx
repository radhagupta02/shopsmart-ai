import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const WishlistContext = createContext(null);

/**
 * Wishlist context skeleton. A2 completes with real API calls.
 */
export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Skeleton functions – A2 fills these in
  const fetchWishlist = useCallback(async () => {}, []);
  const addItem = useCallback(async (productId) => {}, []);
  const removeItem = useCallback(async (productId) => {}, []);
  const isWishlisted = useCallback((productId) => items.some((i) => i.productId === productId), [items]);

  const value = useMemo(
    () => ({
      items,
      loading,
      count: items.length,
      fetchWishlist,
      addItem,
      removeItem,
      isWishlisted,
    }),
    [items, loading, fetchWishlist, addItem, removeItem, isWishlisted],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
