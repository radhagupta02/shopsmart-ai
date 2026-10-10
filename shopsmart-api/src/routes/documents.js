import express from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import * as documentsController from '../controllers/documentsController.js';

const router = express.Router();

const uploadSchema = {
  body: z.object({
    version: z.string().min(1),
    effectiveDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
    category: z.string().min(1),
    region: z.string().min(1),
    title: z.string().optional()
  })
};

router.use(requireAuth);
router.use(requireRole('ADMIN'));

router.post('/', upload.single('file'), validate(uploadSchema), documentsController.uploadDocument);
router.get('/', documentsController.getDocuments);

export default router;
