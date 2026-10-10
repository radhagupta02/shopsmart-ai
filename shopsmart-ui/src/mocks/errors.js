import { ApiError } from '../utils/ApiError.js';

/**
 * Creates an ApiError configured with both error message and details array
 * matching CONTRACT { error, details }.
 */
export function createMockError(message, status = 400, details = []) {
  const err = new ApiError(message, status, details);
  err.error = message;
  return err;
}
