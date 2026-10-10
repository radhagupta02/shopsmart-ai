import React, { useId } from 'react';

/**
 * Accessible Input component with labelled input, error message, helper text,
 * and visible focus ring per AGENTS.md.
 */
export default function Input({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  prefixIcon = null,
  suffixIcon = null,
  className = '',
  inputClassName = '',
  ...rest
}) {
  const generatedId = useId();
  const inputId = id || name || generatedId;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--color-slate-700)] flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-[var(--color-danger)] ml-1" aria-hidden="true">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {prefixIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-[var(--color-slate-400)]">
            {prefixIcon}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[var(--color-slate-900)] placeholder:text-[var(--color-slate-400)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 disabled:bg-[var(--color-slate-100)] disabled:cursor-not-allowed ${
            prefixIcon ? 'pl-10' : ''
          } ${suffixIcon ? 'pr-10' : ''} ${
            error
              ? 'border-[var(--color-danger)] focus-visible:outline-[var(--color-danger)]'
              : 'border-[var(--color-slate-300)] hover:border-[var(--color-slate-400)] focus-visible:outline-[var(--color-primary)]'
          } ${inputClassName}`}
          {...rest}
        />

        {suffixIcon && (
          <div className="absolute right-3 flex items-center text-[var(--color-slate-400)]">
            {suffixIcon}
          </div>
        )}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-[var(--color-danger)] font-medium m-0 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="text-xs text-[var(--color-slate-500)] m-0">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
