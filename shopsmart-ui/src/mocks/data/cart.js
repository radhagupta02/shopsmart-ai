import { PRODUCTS, computeAvailability } from './products.js';

/**
 * In-memory cart store for mock mode.
 * Seeded with LAP101 (Dell Inspiron 15).
 */
let mockCartItems = [
  {
    productId: 'LAP101',
    quantity: 1,
  },
];

export function computeShippingEstimate(tier = 'BASIC', subtotal = 0) {
  const normTier = (tier || 'BASIC').toUpperCase();
  if (normTier === 'PRIME' || normTier === 'PREMIUM') return 0.00;
  return subtotal >= 50.00 ? 0.00 : 4.99;
}

export function getCartState(tier = 'BASIC') {
  const items = mockCartItems.map((cartItem) => {
    const product = PRODUCTS.find((p) => p.id === cartItem.productId) || {
      id: cartItem.productId,
      name: 'Product',
      price: 0,
      stockQty: 10,
      images: [],
    };
    const unitPrice = product.price;
    const lineTotal = Number((unitPrice * cartItem.quantity).toFixed(2));
    return {
      productId: product.id,
      name: product.name,
      imageUrl: product.images?.[0] || `https://picsum.photos/seed/${product.id}/600/450`,
      unitPrice,
      quantity: cartItem.quantity,
      lineTotal,
      availability: computeAvailability(product.stockQty),
    };
  });

  const subtotal = Number(items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
  const shippingEstimate = computeShippingEstimate(tier, subtotal);
  const total = Number((subtotal + shippingEstimate).toFixed(2));

  return {
    items,
    subtotal,
    shippingEstimate,
    total,
  };
}

export function addToCart(productId, quantity = 1, tier = 'BASIC') {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product || product.stockQty <= 0) {
    const err = new Error('Product is out of stock');
    err.status = 409;
    throw err;
  }

  const existing = mockCartItems.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity = Math.min(10, existing.quantity + quantity);
  } else {
    mockCartItems.push({ productId, quantity: Math.min(10, quantity) });
  }

  return getCartState(tier);
}

export function updateCartQuantity(productId, quantity, tier = 'BASIC') {
  if (quantity <= 0) {
    mockCartItems = mockCartItems.filter((item) => item.productId !== productId);
  } else {
    const item = mockCartItems.find((i) => i.productId === productId);
    if (item) {
      item.quantity = Math.min(10, quantity);
    }
  }
  return getCartState(tier);
}

export function removeCartItemById(productId, tier = 'BASIC') {
  mockCartItems = mockCartItems.filter((item) => item.productId !== productId);
  return getCartState(tier);
}

export function clearCart() {
  mockCartItems = [];
}
