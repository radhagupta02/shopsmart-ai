import { query } from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { getProductById } from './productService.js';

export const getWishlist = async (userId) => {
  const result = await query(`
    SELECT p.id, p.name, p.brand, p.category_id as "categoryId", p.price, p.rating, p.stock_qty as "stockQty",
    CASE WHEN p.stock_qty = 0 THEN 'OUT_OF_STOCK' WHEN p.stock_qty <= 5 THEN 'LOW_STOCK' ELSE 'IN_STOCK' END as availability,
    p.images[1] as "imageUrl"
    FROM wishlist_items w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = $1
    ORDER BY p.name ASC
  `, [userId]);
  return result.rows;
};

export const addWishlist = async (userId, productId) => {
  await getProductById(productId); // throws 404 if not found
  await query(`INSERT INTO wishlist_items (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [userId, productId]);
};

export const removeWishlist = async (userId, productId) => {
  await query(`DELETE FROM wishlist_items WHERE user_id = $1 AND product_id = $2`, [userId, productId]);
};
