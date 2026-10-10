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

const shopSchema = {
  body: z.object({
    message: z.string().min(1).max(1000),
    history: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string()
    })).optional()
  })
};

const chatSchema = {
  body: z.object({
    message: z.string().min(1).max(1000),
    history: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string()
    })).optional(),
    region: z.string().optional()
  })
};

router.post('/ask', validate(askSchema), assistantController.askPolicy);
router.post('/shop', validate(shopSchema), assistantController.shop);
router.post('/chat', validate(chatSchema), assistantController.chat);

export default router;
