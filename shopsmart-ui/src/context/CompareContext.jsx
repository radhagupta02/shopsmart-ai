import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { useToast } from './ToastContext.jsx';

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareIds, setCompareIds] = useLocalStorage('ss_compare', []);
  const toast = useToast();

  const isCompared = useCallback(
    (id) => compareIds.includes(id),
    [compareIds]
  );

  const addCompare = useCallback(
    (id) => {
      if (compareIds.includes(id)) return;
      if (compareIds.length >= 3) {
        toast?.error?.('You can compare a maximum of 3 items');
        return;
      }
      setCompareIds([...compareIds, id]);
    },
    [compareIds, setCompareIds, toast]
  );

  const removeCompare = useCallback(
    (id) => {
      setCompareIds(compareIds.filter((item) => item !== id));
    },
    [compareIds, setCompareIds]
  );

  const toggleCompare = useCallback(
    (id) => {
      if (compareIds.includes(id)) {
        removeCompare(id);
      } else {
        addCompare(id);
      }
    },
    [compareIds, addCompare, removeCompare]
  );

  const clearCompare = useCallback(() => {
    setCompareIds([]);
  }, [setCompareIds]);

  const value = useMemo(
    () => ({
      compareIds,
      isCompared,
      addCompare,
      removeCompare,
      toggleCompare,
      clearCompare,
    }),
    [compareIds, isCompared, addCompare, removeCompare, toggleCompare, clearCompare]
  );

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    // Graceful fallback if called outside provider
    return {
      compareIds: [],
      isCompared: () => false,
      addCompare: () => {},
      removeCompare: () => {},
      toggleCompare: () => {},
      clearCompare: () => {},
    };
  }
  return ctx;
}
