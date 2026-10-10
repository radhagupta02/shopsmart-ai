import React from 'react';
import CompareBar from '../products/CompareBar.jsx';
import { CompareProvider } from '../../context/CompareContext.jsx';
import { useAssistant } from '../../context/AssistantContext.jsx';
import AssistantPanel from '../assistant/AssistantPanel.jsx';

/**
 * Main Layout wrapper providing CompareProvider, CompareBar,
 * and Assistant panel slot per AGENTS.md § Layout.
 */
export default function Layout({ children }) {
  const { isOpen } = useAssistant();

  return (
    <CompareProvider>
      <div className="min-h-screen flex flex-col bg-[var(--color-slate-50)] text-[var(--color-slate-900)]">
        <div className="flex-1">
          {children}
        </div>

        {/* Sticky compare bar */}
        <CompareBar />

        {/* Assistant panel slot (supplied by Dev B in Phase B1) */}
        <div
          id="assistant-panel-slot"
          aria-live="polite"
          className={isOpen ? 'assistant-open' : 'assistant-closed'}
        >
          <AssistantPanel />
        </div>
      </div>
    </CompareProvider>
  );
}
