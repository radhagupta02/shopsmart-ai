import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import * as wishlistApi from '../api/wishlist.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const data = await wishlistApi.getWishlist();
      setItems(data);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, toast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, fetchWishlist]);

  const addItem = useCallback(async (productId) => {
    if (!isAuthenticated) return;
    try {
      // Optimistic update
      setItems(prev => {
        if (prev.some(i => i.productId === productId)) return prev;
        return [...prev, { productId }]; // Minimal optimistic shape
      });
      await wishlistApi.addWishlistItem(productId);
      toast.success('Added to wishlist');
      await fetchWishlist(); // Refresh to get full product details
    } catch (err) {
      toast.error(err.message || 'Failed to add to wishlist');
      await fetchWishlist(); // Revert optimistic update on failure
    }
  }, [isAuthenticated, toast, fetchWishlist]);

  const removeItem = useCallback(async (productId) => {
    if (!isAuthenticated) return;
    try {
      // Optimistic update
      setItems(prev => prev.filter(i => i.productId !== productId));
      await wishlistApi.removeWishlistItem(productId);
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error(err.message || 'Failed to remove from wishlist');
      await fetchWishlist(); // Revert optimistic update on failure
    }
  }, [isAuthenticated, toast, fetchWishlist]);

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
