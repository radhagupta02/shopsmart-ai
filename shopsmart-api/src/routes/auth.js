import express from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
};

router.post('/login', validate(loginSchema), authController.login);

export default router;
