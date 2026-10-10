import React from 'react';

/**
 * Reusable accessible Button component per AGENTS.md § Design.
 * Rounded-lg, 4px grid, visible focus rings, variants: primary, secondary, outline, ghost, danger, ai.
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  ariaLabel,
  icon = null,
  ...rest
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-lg cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }[size] || 'text-sm px-4 py-2 gap-2';

  const variantClasses = {
    primary:
      'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] active:bg-[var(--color-primary-dark)] focus-visible:outline-[var(--color-primary)] shadow-sm',
    secondary:
      'bg-[var(--color-slate-100)] text-[var(--color-slate-800)] hover:bg-[var(--color-slate-200)] focus-visible:outline-[var(--color-slate-600)]',
    outline:
      'border border-[var(--color-slate-300)] bg-white text-[var(--color-slate-700)] hover:bg-[var(--color-slate-50)] hover:border-[var(--color-slate-400)] focus-visible:outline-[var(--color-primary)] shadow-sm',
    ghost:
      'bg-transparent text-[var(--color-slate-600)] hover:bg-[var(--color-slate-100)] hover:text-[var(--color-slate-900)] focus-visible:outline-[var(--color-slate-500)]',
    danger:
      'bg-[var(--color-danger)] text-white hover:bg-red-700 focus-visible:outline-[var(--color-danger)] shadow-sm',
    ai:
      'bg-[var(--color-ai)] text-white hover:bg-purple-700 active:bg-purple-800 focus-visible:outline-[var(--color-ai)] shadow-sm shadow-purple-200',
  }[variant] || 'bg-[var(--color-primary)] text-white';

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
