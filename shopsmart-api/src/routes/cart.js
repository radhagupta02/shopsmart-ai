import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as cartService from '../services/cartService.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const router = express.Router();
router.use(requireAuth);

const itemSchema = {
  body: z.object({
    productId: z.string().min(1).optional(), // only required for POST
    quantity: z.number().int().min(1).max(10)
  })
};

router.get('/', async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id, req.user.tier);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

router.post('/items', validate(itemSchema), async (req, res, next) => {
  try {
    const cart = await cartService.addToCart(req.user.id, req.user.tier, req.body.productId, req.body.quantity);
    res.status(201).json(cart);
  } catch (err) {
    next(err);
  }
});

router.put('/items/:id', validate(itemSchema), async (req, res, next) => {
  try {
    const cart = await cartService.updateCartItem(req.user.id, req.user.tier, req.params.id, req.body.quantity);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

router.delete('/items/:id', async (req, res, next) => {
  try {
    const cart = await cartService.removeCartItem(req.user.id, req.user.tier, req.params.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

export default router;
