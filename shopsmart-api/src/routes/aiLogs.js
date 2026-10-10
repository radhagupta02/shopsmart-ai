import express from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as aiLogService from '../services/aiLogService.js';

const router = express.Router();
router.use(requireAuth);
router.use(requireRole('ADMIN'));

const logsSchema = {
  query: z.object({
    type: z.enum(['POLICY', 'SHOP']).optional(),
    page: z.string().regex(/^d+$/).optional(),
    size: z.string().regex(/^d+$/).optional()
  })
};

router.get('/', validate(logsSchema), async (req, res, next) => {
  try {
    const logs = await aiLogService.getLogs(req.query.type, req.query.page, req.query.size);
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

export default router;
