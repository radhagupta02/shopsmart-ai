import { query } from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { getProductById } from './productService.js';

const computeShipping = (tier, subtotal) => {
  if (tier === 'Prime' || tier === 'Premium') return 0.00;
  return subtotal >= 50 ? 0.00 : 4.99;
};

export const getCart = async (userId, userTier) => {
  const result = await query(`
    SELECT c.product_id as "productId", p.name, p.images[1] as "imageUrl", p.price as "unitPrice", c.quantity,
    (p.price * c.quantity) as "lineTotal", p.stock_qty,
    CASE WHEN p.stock_qty = 0 THEN 'OUT_OF_STOCK' WHEN p.stock_qty <= 5 THEN 'LOW_STOCK' ELSE 'IN_STOCK' END as availability
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = $1
    ORDER BY p.name ASC
  `, [userId]);

  const items = result.rows.map(item => {
    const { stock_qty, ...rest } = item;
    return rest;
  });

  const subtotal = items.reduce((acc, item) => acc + parseFloat(item.lineTotal), 0);
  const shippingEstimate = items.length > 0 ? computeShipping(userTier, subtotal) : 0;
  const total = subtotal + shippingEstimate;

  return { items, subtotal, shippingEstimate, total };
};

export const addToCart = async (userId, userTier, productId, quantity) => {
  const product = await getProductById(productId);
  const current = await query(`SELECT quantity FROM cart_items WHERE user_id = $1 AND product_id = $2`, [userId, productId]);
  const newQty = Math.min((current.rows[0]?.quantity || 0) + quantity, 10);
  
  if (product.stock_qty < newQty) {
    throw new AppError('Insufficient stock', 409);
  }

  await query(`
    INSERT INTO cart_items (user_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET quantity = LEAST(cart_items.quantity + EXCLUDED.quantity, 10)
  `, [userId, productId, quantity]);

  return getCart(userId, userTier);
};

export const updateCartItem = async (userId, userTier, productId, quantity) => {
  const product = await getProductById(productId);
  if (product.stock_qty < quantity) {
    throw new AppError('Insufficient stock', 409);
  }
  
  const res = await query(`UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3`, [quantity, userId, productId]);
  if (res.rowCount === 0) throw new AppError('Item not in cart', 404);
  
  return getCart(userId, userTier);
};

export const removeCartItem = async (userId, userTier, productId) => {
  await query(`DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`, [userId, productId]);
  return getCart(userId, userTier);
};
