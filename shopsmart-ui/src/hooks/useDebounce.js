import { useState, useEffect, useRef } from 'react';

/**
 * Debounce a value by the given delay (ms).
 * @param {*} value - value to debounce
 * @param {number} delay - debounce delay in ms (default 300)
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timerRef.current);
  }, [value, delay]);

  return debouncedValue;
}
