import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as preferenceService from '../services/preferenceService.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const router = express.Router();
router.use(requireAuth);

const preferenceSchema = {
  body: z.object({
    categories: z.array(z.number().int()).optional(),
    brands: z.array(z.string()).optional(),
    budgetMin: z.number().nullable().optional(),
    budgetMax: z.number().nullable().optional()
  })
};

router.get('/me/preferences', async (req, res, next) => {
  try {
    const prefs = await preferenceService.getPreferences(req.user.id);
    res.json(prefs);
  } catch (err) {
    next(err);
  }
});

router.put('/me/preferences', validate(preferenceSchema), async (req, res, next) => {
  try {
    const prefs = await preferenceService.updatePreferences(req.user.id, req.body);
    res.json(prefs);
  } catch (err) {
    next(err);
  }
});

export default router;
