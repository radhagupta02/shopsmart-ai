import {
  getPreferencesData,
  updatePreferencesData,
} from '../data/preferences.js';

export function handleGetPreferences() {
  return getPreferencesData();
}

export function handleUpdatePreferences({ body }) {
  return updatePreferencesData(body);
}
