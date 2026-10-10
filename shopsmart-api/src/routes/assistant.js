import express from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import * as assistantController from '../controllers/assistantController.js';

const router = express.Router();
router.use(requireAuth);

const askSchema = {
  body: z.object({
    question: z.string().min(1).max(500),
    region: z.string().optional()
  })
};

router.post('/ask', validate(askSchema), assistantController.askPolicy);

export default router;
