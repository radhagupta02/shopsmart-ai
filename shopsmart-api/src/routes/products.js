import express from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import * as productController from '../controllers/productController.js';

const router = express.Router();

const getProductsSchema = {
  query: z.object({
    q: z.string().optional(),
    category: z.string().regex(/^\d+$/).optional(),
    brand: z.union([z.string(), z.array(z.string())]).optional(),
    minPrice: z.string().regex(/^\d+(\.\d+)?$/).optional(),
    maxPrice: z.string().regex(/^\d+(\.\d+)?$/).optional(),
    minRating: z.string().regex(/^\d+(\.\d+)?$/).optional(),
    inStock: z.enum(['true', 'false']).optional(),
    sort: z.enum(['relevance', 'price_asc', 'price_desc', 'rating', 'newest']).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    size: z.string().regex(/^\d+$/).optional()
  })
};

const getProductByIdSchema = {
  params: z.object({
    id: z.string().min(1)
  })
};

router.get('/', validate(getProductsSchema), productController.getProducts);
router.get('/:id', validate(getProductByIdSchema), productController.getProductById);

export default router;
