import { AppError } from '../utils/AppError.js';

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return next(new AppError('Forbidden: Insufficient role', 403));
    }
    next();
  };
};
