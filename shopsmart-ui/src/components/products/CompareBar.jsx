import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext.jsx';
import Button from '../ui/Button.jsx';

/**
 * Sticky floating bar shown when items are selected for comparison.
 */
export default function CompareBar() {
  const { compareIds, removeCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  if (!compareIds || compareIds.length === 0) return null;

  return (
    <aside
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl bg-slate-900/95 backdrop-blur-md text-white rounded-2xl px-5 py-3.5 shadow-2xl border border-slate-700 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-200"
      aria-label="Product comparison panel"
    >
      <div className="flex items-center gap-3 overflow-x-auto py-1">
        <div className="shrink-0 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-ai)] animate-pulse" />
          <span className="text-sm font-semibold whitespace-nowrap">
            Compare ({compareIds.length}/3)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {compareIds.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-mono border border-slate-700 text-slate-200 shrink-0"
            >
              <span>{id}</span>
              <button
                type="button"
                onClick={() => removeCompare(id)}
                className="hover:text-red-400 p-0.5 rounded transition-colors focus-visible:outline-1"
                aria-label={`Remove ${id} from compare`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={clearCompare}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 transition-colors"
        >
          Clear
        </button>

        <Button
          size="sm"
          variant="ai"
          onClick={() => navigate('/compare')}
          className="font-medium whitespace-nowrap"
        >
          Compare
        </Button>
      </div>
    </aside>
  );
}
