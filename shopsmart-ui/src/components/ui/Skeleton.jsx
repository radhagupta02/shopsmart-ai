import React from 'react';

/**
 * Base pulsing skeleton block.
 */
export function Skeleton({ className = '', rounded = 'rounded-md', ...rest }) {
  return (
    <div
      className={`animate-pulse bg-[var(--color-slate-200)] ${rounded} ${className}`}
      aria-hidden="true"
      {...rest}
    />
  );
}

/**
 * Skeleton lines for text content.
 */
export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2.5 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/5' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

/**
 * Product Card Skeleton placeholder matching ProductCard structure.
 */
export function SkeletonCard() {
  return (
    <div
      className="flex flex-col rounded-xl border border-[var(--color-slate-200)] bg-white p-4 shadow-xs"
      aria-hidden="true"
    >
      <Skeleton className="w-full aspect-[4/3] rounded-lg mb-4" />
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-4 w-20 rounded-full" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-5 w-4/5 mb-2" />
      <Skeleton className="h-4 w-full mb-3" />
      <div className="mt-auto pt-3 border-t border-[var(--color-slate-100)] flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Grid of product card skeletons.
 */
export function SkeletonGrid({ count = 8, columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' }) {
  return (
    <div className={`grid gap-5 ${columns}`} aria-label="Loading products">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default Skeleton;
