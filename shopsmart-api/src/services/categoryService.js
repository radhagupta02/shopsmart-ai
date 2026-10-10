import { query } from '../config/db.js';

export const getCategories = async () => {
  const result = await query('SELECT * FROM categories ORDER BY id ASC');
  const categories = result.rows;

  const categoryMap = new Map();
  categories.forEach(c => categoryMap.set(c.id, { ...c, children: [] }));

  const tree = [];
  categories.forEach(c => {
    if (c.parent_id === null) {
      tree.push(categoryMap.get(c.id));
    } else {
      const parent = categoryMap.get(c.parent_id);
      if (parent) {
        parent.children.push(categoryMap.get(c.id));
      }
    }
  });

  return tree;
};
