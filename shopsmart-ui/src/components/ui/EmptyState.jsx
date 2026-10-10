import React from 'react';

/**
 * Reusable EmptyState component per AGENTS.md.
 * Displays when a query returns no results, wishlist is empty, or preferences are not set.
 */
export default function EmptyState({
  title,
  description,
  icon = null,
  action = null,
  phase = null,
  className = '',
}) {
  const displayTitle = title || (phase ? `Phase ${phase}` : 'No items found');
  const displayDescription =
    description || (phase ? `Coming in phase ${phase}` : 'There are no items matching your criteria.');

  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-6 max-w-md mx-auto ${className}`}
      role="status"
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mb-5 text-2xl shadow-xs">
        {icon || (
          <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>

      <h3 className="text-lg font-bold text-[var(--color-slate-900)] mb-2">
        {displayTitle}
      </h3>

      <p className="text-sm text-[var(--color-slate-500)] mb-6 max-w-sm">
        {displayDescription}
      </p>

      {action && (
        <div className="flex items-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
}
