import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';

/**
 * Enterprise Product Card component per AGENTS.md § Design.
 * Features: Image, name, brand, price, rating, stock badge,
 * wishlist heart, Add to Cart, Compare checkbox.
 */
export default function ProductCard({ product }) {
  const { isCompared, toggleCompare } = useCompare();
  const { isWishlisted, addItem: addWishlist, removeItem: removeWishlist } = useWishlist();
  const { addItem: addCart } = useCart();
  const toast = useToast();

  if (!product) return null;

  const compared = isCompared(product.id);
  const wishlisted = isWishlisted ? isWishlisted(product.id) : false;
  const isOutOfStock = product.stockQty <= 0 || product.availability === 'OUT_OF_STOCK';

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (wishlisted) {
        await removeWishlist?.(product.id);
        toast?.info?.(`Removed ${product.name} from wishlist`);
      } else {
        await addWishlist?.(product.id);
        toast?.success?.(`Added ${product.name} to wishlist`);
      }
    } catch {
      toast?.info?.(`${product.name} wishlist updated`);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      toast?.error?.('Sorry, this item is currently out of stock');
      return;
    }
    try {
      await addCart?.(product.id, 1);
      toast?.success?.(`Added ${product.name} to cart`);
    } catch (err) {
      toast?.error?.(err?.message || 'Failed to add item to cart');
    }
  };

  return (
    <div className="group relative flex flex-col rounded-xl border border-[var(--color-slate-200)] bg-white p-4 shadow-xs hover:shadow-md hover:border-[var(--color-slate-300)] transition-all duration-200">
      {/* Top action row: Stock badge + Wishlist button */}
      <div className="flex items-center justify-between mb-2.5 z-10">
        <Badge type="stock">{product.availability}</Badge>

        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`p-1.5 rounded-full transition-colors focus-visible:outline-2 ${
            wishlisted
              ? 'text-red-500 bg-red-50 hover:bg-red-100'
              : 'text-[var(--color-slate-400)] hover:text-red-500 hover:bg-slate-100'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className="w-4 h-4"
            fill={wishlisted ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Image thumbnail */}
      <Link
        to={`/products/${product.id}`}
        className="block relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[var(--color-slate-100)] mb-3 group-hover:opacity-95"
      >
        <img
          src={product.imageUrl || `https://picsum.photos/seed/${product.id}/600/450`}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://picsum.photos/seed/placeholder/600/450';
          }}
        />
      </Link>

      {/* Product metadata */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs text-[var(--color-slate-500)] mb-1">
          <span className="font-semibold uppercase tracking-wider text-[11px] truncate max-w-[120px]">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 font-medium text-amber-600">
            <span>★</span>
            <span>{Number(product.rating || 0).toFixed(1)}</span>
          </div>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="text-sm font-bold text-[var(--color-slate-900)] hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-snug mb-2"
        >
          {product.name}
        </Link>

        {/* Price & Stock info */}
        <div className="mt-auto pt-2 flex items-baseline justify-between mb-3">
          <span className="text-lg font-extrabold text-[var(--color-slate-900)]">
            ${Number(product.price || 0).toFixed(2)}
          </span>
          {product.stockQty > 0 && product.stockQty <= 5 && (
            <span className="text-[11px] font-medium text-amber-700">
              Only {product.stockQty} left!
            </span>
          )}
        </div>

        {/* Action row: Add to cart + Compare checkbox */}
        <div className="pt-2 border-t border-[var(--color-slate-100)] flex items-center justify-between gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-[var(--color-slate-600)] hover:text-[var(--color-slate-900)] select-none">
            <input
              type="checkbox"
              checked={compared}
              onChange={() => toggleCompare(product.id)}
              className="rounded border-[var(--color-slate-300)] text-[var(--color-ai)] focus:ring-[var(--color-ai)] w-3.5 h-3.5"
            />
            <span>Compare</span>
          </label>

          <Button
            size="sm"
            variant={isOutOfStock ? 'secondary' : 'primary'}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="text-xs px-3 py-1.5"
          >
            {isOutOfStock ? 'Out of stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}
