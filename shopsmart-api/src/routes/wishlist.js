import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as wishlistService from '../services/wishlistService.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const router = express.Router();
router.use(requireAuth);

const addWishlistSchema = {
  body: z.object({
    productId: z.string().min(1)
  })
};

router.get('/', async (req, res, next) => {
  try {
    const items = await wishlistService.getWishlist(req.user.id);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(addWishlistSchema), async (req, res, next) => {
  try {
    await wishlistService.addWishlist(req.user.id, req.body.productId);
    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:productId', async (req, res, next) => {
  try {
    await wishlistService.removeWishlist(req.user.id, req.params.productId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
