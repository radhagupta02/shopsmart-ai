import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generic data-fetching hook.
 * @param {Function} fetchFn - async function that returns data
 * @param {Object} options
 * @param {boolean} options.immediate - call on mount (default true)
 * @param {Array} options.deps - extra dependencies
 */
export function useFetch(fetchFn, { immediate = true, deps = [] } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFn(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchFn, ...deps],
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, ...deps]);

  return { data, loading, error, execute, setData };
}
