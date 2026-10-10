import React from 'react';

/**
 * Accessible Pagination controls per CONTRACT and AGENTS.md.
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className={`flex items-center justify-center gap-1.5 py-4 ${className}`}
      aria-label="Pagination"
    >
      {/* Prev */}
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange?.(currentPage - 1)}
        className="px-3 py-1.5 text-sm font-medium rounded-lg border border-[var(--color-slate-200)] text-[var(--color-slate-700)] bg-white hover:bg-[var(--color-slate-50)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
        aria-label="Previous page"
      >
        Previous
      </button>

      {/* Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 py-1 text-sm text-[var(--color-slate-400)] select-none"
              >
                ...
              </span>
            );
          }

          const isCurrent = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange?.(p)}
              aria-current={isCurrent ? 'page' : undefined}
              className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] ${
                isCurrent
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'bg-white text-[var(--color-slate-700)] hover:bg-[var(--color-slate-100)] border border-[var(--color-slate-200)]'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
        className="px-3 py-1.5 text-sm font-medium rounded-lg border border-[var(--color-slate-200)] text-[var(--color-slate-700)] bg-white hover:bg-[var(--color-slate-50)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
