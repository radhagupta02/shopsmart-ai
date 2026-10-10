import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProduct } from '../../api/products.js';
import { Button, Badge, SkeletonCard, ErrorState } from '../ui/index.js';

export default function RecommendationCard({ recommendation }) {
  const { productId, productName, reason, availability } = recommendation;
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProduct(productId);
        if (mounted) {
          setProduct(data);
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
    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [productId]);

  if (loading) {
    return <div className="p-4 border rounded-xl shadow-sm bg-white mt-2"><SkeletonCard /></div>;
  }

  if (error) {
    return (
      <div className="p-4 border rounded-xl shadow-sm bg-white mt-2">
        <ErrorState message={error} onRetry={() => setLoading(true)} inline />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="p-4 border border-[var(--color-slate-200)] rounded-xl shadow-sm bg-white mt-2 flex flex-col sm:flex-row gap-4 items-start">
      <div className="w-full sm:w-24 h-24 shrink-0 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
        {product.imageUrl || (product.images && product.images[0]) ? (
          <img
            src={product.imageUrl || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-slate-400 text-xs">No image</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-[var(--color-slate-900)] truncate">{product.name}</h4>
          <span className="font-bold text-[var(--color-slate-900)] whitespace-nowrap">${Number(product.price).toFixed(2)}</span>
        </div>
        <div className="mt-1 flex flex-wrap gap-2">
          <Badge
            variant={
              availability === 'IN_STOCK' ? 'success' :
              availability === 'LOW_STOCK' ? 'warning' : 'danger'
            }
          >
            {availability.replace(/_/g, ' ')}
          </Badge>
          <Badge variant="neutral">{product.brand}</Badge>
        </div>
        <div className="mt-2 text-sm text-[var(--color-slate-700)] bg-[var(--color-primary-light)] p-2 rounded-md">
          <strong className="text-[var(--color-primary-dark)]">Why this? </strong>
          {reason}
        </div>
        <div className="mt-3 flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/products/${productId}`)}>
            View Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={availability === 'OUT_OF_STOCK'}
            onClick={() => {
              alert(`Added ${product.name} to cart`);
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
