/**
 * Custom error for API failures.
 * Carries the HTTP status, a human-readable message, and optional field details.
 */
export class ApiError extends Error {
  /**
   * @param {string} message - human-readable message
   * @param {number} status - HTTP status code
   * @param {Array} details - [{field, message}] from the server
   */
  constructor(message, status, details = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}
