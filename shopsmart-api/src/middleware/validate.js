import { AppError } from '../utils/AppError.js';

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      if (schema.body) req.body = schema.body.parse(req.body);
      if (schema.query) req.query = schema.query.parse(req.query);
      if (schema.params) req.params = schema.params.parse(req.params);
      next();
    } catch (err) {
      const details = err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message
      }));
      next(new AppError('Validation failed', 400, details));
    }
  };
};
