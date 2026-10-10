import { post } from './client.js';

/**
 * POST /auth/login
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: {id, name, tier, role}}>}
 */
export function login(email, password) {
  return post('/auth/login', { email, password }, { skipAuth: true });
}
