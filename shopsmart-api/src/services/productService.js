import { query } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export const getProducts = async (filters) => {
  const {
    q, category, brand, minPrice, maxPrice, minRating, inStock, sort, page = 1, size = 12
  } = filters;

  const limit = Math.min(parseInt(size) || 12, 50);
  const offset = (Math.max(parseInt(page) || 1, 1) - 1) * limit;

  let whereClauses = [];
  let params = [];
  let paramIdx = 1;

  if (q) {
    whereClauses.push(`(name ILIKE $${paramIdx} OR description ILIKE $${paramIdx})`);
    params.push(`%${q}%`);
    paramIdx++;
  }

  if (category) {
    whereClauses.push(`category_id IN (
      WITH RECURSIVE cat_tree AS (
        SELECT id FROM categories WHERE id = $${paramIdx}
        UNION
        SELECT c.id FROM categories c INNER JOIN cat_tree ct ON c.parent_id = ct.id
      ) SELECT id FROM cat_tree
    )`);
    params.push(parseInt(category));
    paramIdx++;
  }

  if (brand) {
    let brandsArray = Array.isArray(brand) ? brand : [brand];
    let placeholders = brandsArray.map((_, i) => `$${paramIdx + i}`).join(', ');
    whereClauses.push(`brand IN (${placeholders})`);
    params.push(...brandsArray);
    paramIdx += brandsArray.length;
  }

  if (minPrice) {
    whereClauses.push(`price >= $${paramIdx}`);
    params.push(parseFloat(minPrice));
    paramIdx++;
  }

  if (maxPrice) {
    whereClauses.push(`price <= $${paramIdx}`);
    params.push(parseFloat(maxPrice));
    paramIdx++;
  }

  if (minRating) {
    whereClauses.push(`rating >= $${paramIdx}`);
    params.push(parseFloat(minRating));
    paramIdx++;
  }

  if (inStock === 'true' || inStock === true) {
    whereClauses.push(`stock_qty > 0`);
  } else if (inStock === 'false' || inStock === false) {
    whereClauses.push(`stock_qty = 0`);
  }

  let orderBy = '';
  if (sort === 'price_asc') orderBy = 'price ASC';
  else if (sort === 'price_desc') orderBy = 'price DESC';
  else if (sort === 'rating') orderBy = 'rating DESC NULLS LAST';
  else if (sort === 'newest') orderBy = 'id DESC';
  else if (sort === 'relevance' || !sort) {
    if (q) {
      orderBy = `ts_rank(to_tsvector('english', name || ' ' || description), plainto_tsquery('english', $1)) DESC`;
    } else {
      orderBy = 'rating DESC NULLS LAST';
    }
  }

  const whereSql = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';
  const countSql = `SELECT COUNT(*) FROM products ${whereSql}`;
  const dataSql = `SELECT * FROM products ${whereSql} ORDER BY ${orderBy} LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;

  const countResult = await query(countSql, params);
  const totalItems = parseInt(countResult.rows[0].count);

  const dataResult = await query(dataSql, [...params, limit, offset]);
  const items = dataResult.rows;

  return {
    items,
    page: parseInt(page) || 1,
    totalPages: Math.ceil(totalItems / limit),
    totalItems
  };
};

export const getProductById = async (id) => {
  const result = await query('SELECT * FROM products WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    throw new AppError('Product not found', 404);
  }
  return result.rows[0];
};
