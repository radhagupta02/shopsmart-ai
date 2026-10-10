/**
 * In-memory user preferences for mock mode.
 * Default preferences match sample profile.
 */
let mockPreferences = {
  categories: [2, 3], // Laptops, Smartphones
  brands: ['Dell', 'Lenovo', 'Apple', 'Samsung'],
  budgetMin: 300,
  budgetMax: 1200,
};

export function getPreferencesData() {
  return { ...mockPreferences };
}

export function updatePreferencesData(newPrefs) {
  mockPreferences = {
    categories: Array.isArray(newPrefs?.categories) ? newPrefs.categories : mockPreferences.categories,
    brands: Array.isArray(newPrefs?.brands) ? newPrefs.brands : mockPreferences.brands,
    budgetMin: typeof newPrefs?.budgetMin === 'number' ? newPrefs.budgetMin : mockPreferences.budgetMin,
    budgetMax: typeof newPrefs?.budgetMax === 'number' ? newPrefs.budgetMax : mockPreferences.budgetMax,
  };
  return { ...mockPreferences };
}
