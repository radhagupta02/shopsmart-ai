import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAssistant } from '../../context/AssistantContext.jsx';
import { Button, Input } from '../ui/index.js';
import ChatMessage from './ChatMessage.jsx';

const SUGGESTED_QUESTIONS = [
  "Suggest a laptop under $1000 for Java development and AI projects",
  "Can I return an opened laptop?",
  "What is the refund timeline?",
  "Does Prime membership include free delivery?",
  "Can I cancel my order after shipment?"
];

export default function AssistantPanel({ embedded = false }) {
  const { isOpen, close, open, mode, setMode, messages, sendMessage, isLoading, clearChat, options } = useAssistant();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // If not embedded (meaning it's the floating panel), and we are on /assistant, don't show the floating panel
  if (!embedded && location.pathname === '/assistant') {
    return null;
  }

  // Pre-fill input if options.prefill is provided
  useEffect(() => {
    if (options?.prefill) {
      setInputValue(options.prefill);
    }
  }, [options]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const text = inputValue.trim();
    setInputValue('');
    sendMessage(text, mode);
  };

  const handleQuickReply = (text) => {
    sendMessage(text, mode);
  };

  const panelContent = (
    <div className="flex flex-col h-full bg-white sm:rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex-1">
      {/* Header */}
      <div className="bg-[var(--color-primary-dark)] text-white p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="font-semibold text-lg">ShopSmart AI</h2>
        </div>
        {!embedded && (
          <button onClick={close} className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors" aria-label="Close Assistant">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Mode Switcher */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center justify-between shrink-0">
        <div className="flex bg-slate-200/50 p-1 rounded-lg w-full max-w-[240px]">
          <button
            onClick={() => setMode('SHOP')}
            className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${mode === 'SHOP' ? 'bg-white text-[var(--color-primary)] shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Shop
          </button>
          <button
            onClick={() => setMode('POLICY')}
            className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${mode === 'POLICY' ? 'bg-white text-[var(--color-primary)] shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Policy
          </button>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="text-xs text-slate-500 hover:text-slate-800 underline px-2">
            Clear
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50" aria-live="polite">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">How can I help you today?</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-xs">Ask me about products, recommendations, or our store policies.</p>
            
            <div className="flex flex-col gap-2 w-full max-w-md">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const nextMode = q.includes('laptop under') ? 'SHOP' : 'POLICY';
                    if (mode !== nextMode) setMode(nextMode);
                    sendMessage(q, nextMode);
                  }}
                  className="text-left text-sm bg-white border border-slate-200 p-3 rounded-xl shadow-sm hover:border-[var(--color-primary)] hover:shadow-md transition-all text-slate-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} onQuickReply={handleQuickReply} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-slate-200 flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ask about ${mode === 'SHOP' ? 'products...' : 'policies...'}`}
            className="flex-1 bg-slate-100 border-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-full px-4 py-2.5 text-sm"
            disabled={isLoading}
          />
          <Button type="submit" variant="primary" disabled={!inputValue.trim() || isLoading} className="rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </Button>
        </form>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div className="h-full w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col">
        {panelContent}
      </div>
    );
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => open()}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center z-40 focus:ring-4 focus:ring-primary/30"
          aria-label="Open AI Assistant"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Floating Panel (Sheet on mobile) */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-[400px] sm:h-[600px] flex flex-col pointer-events-auto bg-black/50 sm:bg-transparent">
          <div className="flex-1 sm:flex-none flex flex-col mt-16 sm:mt-0 bg-white sm:bg-transparent sm:h-full rounded-t-2xl sm:rounded-none overflow-hidden">
             {panelContent}
          </div>
        </div>
      )}
    </>
  );
}
