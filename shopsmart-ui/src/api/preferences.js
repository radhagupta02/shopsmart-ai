import { get, put } from './client.js';

/**
 * GET /users/me/preferences
 * @returns {Promise<{categories, brands, budgetMin, budgetMax}>}
 */
export function getPreferences() {
  return get('/users/me/preferences');
}

/**
 * PUT /users/me/preferences
 * @param {Object} prefs - { categories, brands, budgetMin, budgetMax }
 */
export function updatePreferences(prefs) {
  return put('/users/me/preferences', prefs);
}
