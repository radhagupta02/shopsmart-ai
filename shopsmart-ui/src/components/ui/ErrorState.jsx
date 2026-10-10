import React from 'react';
import Button from './Button.jsx';

/**
 * Reusable inline ErrorState with retry button.
 */
export default function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading data.',
  onRetry = null,
  className = '',
}) {
  return (
    <div
      className={`rounded-xl border border-red-200 bg-red-50/50 p-6 text-center max-w-md mx-auto my-6 ${className}`}
      role="alert"
    >
      <div className="w-12 h-12 rounded-full bg-red-100 text-[var(--color-danger)] mx-auto flex items-center justify-center mb-3">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="text-base font-bold text-red-900 mb-1">{title}</h3>
      <p className="text-sm text-red-700 mb-4">{message}</p>

      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
