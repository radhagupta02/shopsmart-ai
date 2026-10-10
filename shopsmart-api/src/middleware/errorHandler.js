import { logger } from '../utils/logger.js';
import { AppError } from '../utils/AppError.js';

export const errorHandler = (err, req, res, next) => {
  if (err.name === 'MulterError' && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large (limit 10MB)', details: [] });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.message,
      details: err.details || []
    });
  }

  logger.error(err);
  return res.status(500).json({ error: 'Internal server error', details: [] });
};
