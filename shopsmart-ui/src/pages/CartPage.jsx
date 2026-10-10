import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { createOrder } from '../api/orders.js';
import { Button, EmptyState, Skeleton, Badge } from '../components/ui/index.js';

export default function CartPage() {
  const { items, subtotal, shippingEstimate, total, loading, updateItem, removeItem, clearCart } = useCart();
  const [placingOrder, setPlacingOrder] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      const order = await createOrder();
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${order.id}`);
    } catch (err) {
      if (err.status === 409 || (err.message && err.message.includes('409'))) {
        toast.error('Cannot place order: Some items are out of stock or your cart is empty.');
      } else {
        toast.error(err.message || 'Failed to place order.');
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <div className="w-full lg:w-80 h-64">
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Looks like you haven't added anything to your cart yet."
        actionLabel="Browse Products"
        onAction={() => navigate('/products')}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items List */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <Link to={`/products/${item.productId}`} className="shrink-0">
                <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-400">No image</span>
                  )}
                </div>
              </Link>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link to={`/products/${item.productId}`} className="font-semibold text-lg text-slate-900 hover:text-[var(--color-primary)]">
                      {item.name}
                    </Link>
                    <div className="mt-1 flex gap-2">
                      {item.availability && (
                        <Badge variant={item.availability === 'IN_STOCK' ? 'success' : item.availability === 'LOW_STOCK' ? 'warning' : 'danger'}>
                          {item.availability.replace(/_/g, ' ')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${Number(item.lineTotal || item.unitPrice * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-slate-500">${Number(item.unitPrice).toFixed(2)} each</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                    <button 
                      onClick={() => updateItem(item.productId, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1.5 hover:bg-slate-200 transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1 || loading}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateItem(item.productId, Math.min(10, item.quantity + 1))}
                      className="px-3 py-1.5 hover:bg-slate-200 transition-colors disabled:opacity-50"
                      disabled={item.quantity >= 10 || loading}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-red-600 hover:text-red-800 font-medium px-2 py-1"
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">${Number(subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-medium text-slate-900">
                  {Number(shippingEstimate) === 0 ? 'Free' : `$${Number(shippingEstimate).toFixed(2)}`}
                </span>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-extrabold text-2xl text-[var(--color-primary-dark)]">${Number(total).toFixed(2)}</span>
              </div>
            </div>
            
            <Button
              variant="primary"
              className="w-full py-3 text-lg"
              disabled={placingOrder || loading || items.some(i => i.availability === 'OUT_OF_STOCK')}
              onClick={handlePlaceOrder}
            >
              {placingOrder ? 'Processing...' : 'Place Order'}
            </Button>
            
            {items.some(i => i.availability === 'OUT_OF_STOCK') && (
              <p className="mt-3 text-sm text-red-600 text-center font-medium">
                Please remove out of stock items to checkout.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
