import multer from 'multer';
import { AppError } from '../utils/AppError.js';

const storage = multer.memoryStorage();
const allowedMimeTypes = ['application/pdf', 'text/markdown', 'application/json'];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Unsupported file type. Allowed: .pdf, .md, .json', 415), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter
});
