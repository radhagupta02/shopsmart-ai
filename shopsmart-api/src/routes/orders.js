import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as orderService from '../services/orderService.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const router = express.Router();
router.use(requireAuth);

const paginationSchema = {
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    size: z.string().regex(/^\d+$/).optional()
  })
};

router.post('/', async (req, res, next) => {
  try {
    const order = await orderService.placeOrder(req.user.id, req.user.tier);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

router.get('/', validate(paginationSchema), async (req, res, next) => {
  try {
    const orders = await orderService.getOrders(req.user.id, req.query.page, req.query.size);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'ADMIN';
    const order = await orderService.getOrderById(req.params.id, req.user.id, isAdmin);
    res.json(order);
  } catch (err) {
    next(err);
  }
});

export default router;
