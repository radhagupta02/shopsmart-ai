import { useState, useCallback } from 'react';

/**
 * Persist state in localStorage. Falls back to initialValue on errors.
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.error(`useLocalStorage: failed to set "${key}"`, err);
      }
    },
    [key, storedValue],
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (err) {
      console.error(`useLocalStorage: failed to remove "${key}"`, err);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
