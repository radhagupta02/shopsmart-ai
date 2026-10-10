import * as categoryService from '../services/categoryService.js';

export const getCategories = async (req, res, next) => {
  try {
    const tree = await categoryService.getCategories();
    res.json(tree);
  } catch (err) {
    next(err);
  }
};
