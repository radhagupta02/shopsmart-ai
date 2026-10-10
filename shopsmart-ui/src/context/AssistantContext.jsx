import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import * as assistantApi from '../api/assistant.js';

const AssistantContext = createContext(null);

export function AssistantProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState(null);
  const [mode, setMode] = useState('SHOP'); // 'SHOP' or 'POLICY'
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const open = useCallback((opts = null) => {
    setOptions(opts);
    if (opts?.prefill) {
      // Assuming prefill sets a state that is consumed by the input
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(async (text, currentMode) => {
    const userMsg = { role: 'user', content: text, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      if (currentMode === 'SHOP') {
        const history = messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content || m.interpretedRequirement || m.text || '' }));
        const res = await assistantApi.shop(text, history);
        setMessages(prev => [...prev, { role: 'assistant', type: 'SHOP', ...res, id: Date.now() + 1 }]);
      } else {
        const res = await assistantApi.ask(text);
        setMessages(prev => [...prev, { role: 'assistant', type: 'POLICY', ...res, id: Date.now() + 1 }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'error', error: err.message || 'An error occurred', text, currentMode, id: Date.now() + 1 }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const value = useMemo(
    () => ({ isOpen, options, open, close, toggle, mode, setMode, messages, setMessages, sendMessage, isLoading, clearChat }),
    [isOpen, options, open, close, toggle, mode, messages, sendMessage, isLoading, clearChat]
  );

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant() {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error('useAssistant must be used within AssistantProvider');
  return ctx;
}
