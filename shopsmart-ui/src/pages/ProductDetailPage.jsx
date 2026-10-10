import React, { useState, useEffect, useId } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCompare } from '../context/CompareContext.jsx';
import { useAssistant } from '../context/AssistantContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Button, Badge, Skeleton, ErrorState, EmptyState } from '../components/ui/index.js';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const compareCheckboxId = useId();

  const { addItem: addToCart } = useCart();
  const { isWishlisted, addItem: addWishlist, removeItem: removeWishlist } = useWishlist();
  const { isCompared, toggleCompare } = useCompare();
  const { open: openAssistant } = useAssistant();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let mounted = true;
    const fetchProd = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProduct(id);
        if (mounted) {
          setProduct(data);
          setMainImage(data.imageUrl || (data.images && data.images[0]) || '');
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load product');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    fetchProd();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="w-full aspect-square rounded-2xl" />
            <div className="flex gap-2">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <Skeleton className="w-20 h-20 rounded-lg" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    if (error.includes('404')) {
      return (
        <EmptyState
          title="Product Not Found"
          message={`We couldn't find a product with ID ${id}.`}
          actionLabel="Browse Products"
          onAction={() => window.location.href = '/products'}
        />
      );
    }
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const handleWishlistToggle = () => {
    if (!isAuthenticated) return alert('Please login to use wishlist');
    if (wishlisted) {
      removeWishlist(product.id);
    } else {
      addWishlist(product.id);
    }
  };

  const handleAskAi = () => {
    openAssistant({ prefill: `Tell me more about the ${product.name} (${product.id})` });
  };

  const inStock = product.stockQty > 0;
  const availColor = product.availability === 'IN_STOCK' ? 'success' : product.availability === 'LOW_STOCK' ? 'warning' : 'danger';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 mb-6 flex gap-2">
        <Link to="/products" className="hover:text-primary">Products</Link>
        <span>/</span>
        <span className="text-slate-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center relative group">
            {mainImage ? (
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-slate-400">No Image Available</span>
            )}
            
            {/* Compare overlay */}
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm border border-slate-200/50 flex items-center gap-2">
              <input
                type="checkbox"
                id={compareCheckboxId}
                checked={isCompared(product.id)}
                onChange={() => toggleCompare(product.id)}
                className="rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
              />
              <label htmlFor={compareCheckboxId} className="text-sm font-medium text-slate-700 cursor-pointer select-none">Compare</label>
            </div>
            
            {/* Wishlist overlay */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm border border-slate-200/50 text-slate-400 hover:text-red-500 hover:scale-110 transition-all"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <svg className={`w-6 h-6 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${mainImage === img ? 'border-[var(--color-primary)]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx+1}`} className="w-full h-full object-cover bg-slate-100" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="neutral">{product.brand}</Badge>
            <Badge variant={availColor}>{product.availability?.replace(/_/g, ' ')}</Badge>
          </div>
          
          <h1 className="text-3xl font-bold text-[var(--color-slate-900)] mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-extrabold text-[var(--color-primary-dark)]">${Number(product.price).toFixed(2)}</span>
            <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span className="font-semibold">{Number(product.rating).toFixed(1)}</span>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed mb-8">{product.description}</p>

          {/* Actions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label htmlFor="qty" className="font-medium text-slate-700">Quantity:</label>
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1 || !inStock}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                </button>
                <input
                  id="qty"
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-12 text-center border-none bg-transparent py-2 focus:ring-0 font-medium"
                  disabled={!inStock}
                />
                <button 
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="px-3 py-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
                  disabled={quantity >= 10 || !inStock}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                className="flex-1 text-lg py-3 shadow-md"
                disabled={!inStock}
                onClick={() => addToCart(product.id, quantity)}
              >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                variant="outline"
                className="flex-none flex items-center justify-center gap-2 border-[var(--color-ai)] text-[var(--color-ai)] hover:bg-[var(--color-ai)] hover:text-white"
                onClick={handleAskAi}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Ask AI about this
              </Button>
            </div>
          </div>

          {/* Specs */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex flex-col border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium text-slate-900">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
