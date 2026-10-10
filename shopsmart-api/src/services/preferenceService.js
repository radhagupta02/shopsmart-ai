import { query } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export const getPreferences = async (userId) => {
  const result = await query(`SELECT categories, brands, budget_min as "budgetMin", budget_max as "budgetMax" FROM user_preferences WHERE user_id = $1`, [userId]);
  if (result.rows.length === 0) {
    return { categories: [], brands: [], budgetMin: null, budgetMax: null };
  }
  return result.rows[0];
};

export const updatePreferences = async (userId, data) => {
  const { categories = [], brands = [], budgetMin, budgetMax } = data;
  if (budgetMin !== undefined && budgetMax !== undefined && budgetMin !== null && budgetMax !== null && budgetMin > budgetMax) {
    throw new AppError('budgetMin cannot be greater than budgetMax', 400);
  }

  if (categories.length > 0) {
    const catCheck = await query(`SELECT id FROM categories WHERE id = ANY($1)`, [categories]);
    if (catCheck.rows.length !== categories.length) {
      throw new AppError('One or more categories do not exist', 400);
    }
  }

  await query(`
    INSERT INTO user_preferences (user_id, categories, brands, budget_min, budget_max)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (user_id) DO UPDATE SET
      categories = EXCLUDED.categories,
      brands = EXCLUDED.brands,
      budget_min = EXCLUDED.budget_min,
      budget_max = EXCLUDED.budget_max
  `, [userId, categories, brands, budgetMin, budgetMax]);

  return getPreferences(userId);
};
