import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AssistantContext = createContext(null);

/**
 * Assistant context: controls the floating assistant panel visibility.
 * B1 completes the full UI.
 */
export function AssistantProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState(null);

  const open = useCallback((opts = null) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({ isOpen, options, open, close, toggle }),
    [isOpen, options, open, close, toggle],
  );

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant() {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error('useAssistant must be used within AssistantProvider');
  return ctx;
}
