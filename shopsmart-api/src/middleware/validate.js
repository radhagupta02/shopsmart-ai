import { AppError } from '../utils/AppError.js';

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      if (schema.body) req.body = schema.body.parse(req.body);
      if (schema.query) {
        Object.defineProperty(req, 'query', { value: schema.query.parse(req.query), enumerable: true });
      }
      if (schema.params) {
        Object.defineProperty(req, 'params', { value: schema.params.parse(req.params), enumerable: true });
      }
      next();
    } catch (err) {
      console.error('Validation original error:', err);
      const details = err.errors ? err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message
      })) : [{ field: 'unknown', message: err.message }];
      next(new AppError('Validation failed', 400, details));
    }
  };
};
