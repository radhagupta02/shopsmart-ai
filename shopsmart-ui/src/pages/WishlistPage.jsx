import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { Button, EmptyState, Skeleton, Badge } from '../components/ui/index.js';

export default function WishlistPage() {
  const { items, loading, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();
  const navigate = useNavigate();

  const handleMoveToCart = async (item) => {
    await addToCart(item.productId, 1);
    await removeItem(item.productId);
  };

  if (loading && items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <Skeleton className="w-full aspect-square rounded-2xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        message="Save items you like to your wishlist to easily find them later."
        actionLabel="Explore Products"
        onAction={() => navigate('/products')}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Your Wishlist</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.productId} className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            <Link to={`/products/${item.productId}`} className="w-full aspect-square bg-slate-100 flex items-center justify-center relative overflow-hidden">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <span className="text-sm text-slate-400">No image</span>
              )}
              {item.availability && (
                <div className="absolute top-2 left-2">
                  <Badge variant={item.availability === 'IN_STOCK' ? 'success' : item.availability === 'LOW_STOCK' ? 'warning' : 'danger'}>
                    {item.availability.replace(/_/g, ' ')}
                  </Badge>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeItem(item.productId);
                }}
                className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 hover:bg-white shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Remove from wishlist"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
            </Link>
            
            <div className="p-4 flex flex-col flex-1">
              <Link to={`/products/${item.productId}`} className="font-semibold text-slate-900 mb-1 line-clamp-2 hover:text-[var(--color-primary)]">
                {item.name}
              </Link>
              <div className="text-lg font-bold text-slate-900 mb-4 mt-auto">
                ${Number(item.price || item.unitPrice).toFixed(2)}
              </div>
              
              <Button
                variant="primary"
                className="w-full"
                disabled={item.availability === 'OUT_OF_STOCK'}
                onClick={() => handleMoveToCart(item)}
              >
                {item.availability === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Move to Cart'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
