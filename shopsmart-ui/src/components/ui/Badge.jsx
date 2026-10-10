import React from 'react';

/**
 * Badge component supporting stock, confidence, tier, and general variants
 * per AGENTS.md § Design.
 *
 * Stock: In Stock (green), Low Stock (amber), Out of Stock (red)
 * Confidence: HIGH (green), MEDIUM (amber), LOW (red)
 * Tier: Basic (grey), Prime (blue), Premium (purple/gold)
 */
export default function Badge({
  children,
  type = 'default', // 'stock' | 'confidence' | 'tier' | 'default'
  variant, // specific variant override or inferred from children
  size = 'md',
  className = '',
}) {
  const norm = (val) => String(val || '').toUpperCase().trim();
  const value = norm(variant || children);

  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  let displayText = children;

  // 1. Stock badges
  if (type === 'stock' || value === 'IN_STOCK' || value === 'LOW_STOCK' || value === 'OUT_OF_STOCK') {
    if (value === 'IN_STOCK' || value === 'IN STOCK') {
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      displayText = displayText || 'In Stock';
    } else if (value === 'LOW_STOCK' || value === 'LOW STOCK') {
      badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
      displayText = displayText || 'Low Stock';
    } else if (value === 'OUT_OF_STOCK' || value === 'OUT OF STOCK') {
      badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
      displayText = displayText || 'Out of Stock';
    }
  }
  // 2. Confidence badges
  else if (type === 'confidence' || value === 'HIGH' || value === 'MEDIUM' || value === 'LOW') {
    if (value === 'HIGH') {
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
      displayText = displayText || 'HIGH';
    } else if (value === 'MEDIUM') {
      badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200 font-semibold';
      displayText = displayText || 'MEDIUM';
    } else if (value === 'LOW') {
      badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
      displayText = displayText || 'LOW';
    }
  }
  // 3. Tier badges
  else if (type === 'tier' || value === 'BASIC' || value === 'PRIME' || value === 'PREMIUM') {
    if (value === 'BASIC') {
      badgeStyle = 'bg-slate-100 text-slate-600 border-slate-200 font-medium';
      displayText = displayText || 'Basic';
    } else if (value === 'PRIME') {
      badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
      displayText = displayText || 'Prime';
    } else if (value === 'PREMIUM') {
      badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200 font-semibold shadow-xs';
      displayText = displayText || 'Premium';
    }
  }
  // 4. Custom/general variants
  else if (variant === 'ai') {
    badgeStyle = 'bg-purple-50 text-[var(--color-ai)] border-purple-200 font-semibold';
  } else if (variant === 'primary') {
    badgeStyle = 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-blue-200 font-medium';
  } else if (variant === 'outline') {
    badgeStyle = 'bg-transparent text-slate-700 border-slate-300';
  }

  const sizeClass = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  }[size] || 'text-xs px-2.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border transition-colors select-none ${sizeClass} ${badgeStyle} ${className}`}
    >
      {displayText}
    </span>
  );
}
