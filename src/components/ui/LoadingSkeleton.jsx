import React from 'react';

/**
 * LoadingSkeleton
 * Reusable shimmer placeholder used while data is being fetched.
 * Replaces plain "Loading..." text across the app.
 *
 * variant:
 *   'table'  — renders skeleton rows matching a data table
 *   'cards'  — renders a grid of skeleton cards (for stat/summary rows)
 *   'list'   — renders skeleton list rows (for narrow single-column lists)
 *
 * Props:
 *   variant   'table' | 'cards' | 'list'   (default 'table')
 *   rows      number   Number of skeleton rows/cards (default 5)
 *   columns   number   Number of skeleton columns for 'table' variant (default 5)
 */
function LoadingSkeleton({ variant = 'table', rows = 5, columns = 5 }) {
  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
            <div className="w-10 h-10 rounded-lg bg-gray-100 mb-4" />
            <div className="h-7 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-2.5 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: table variant
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-2.5 bg-gray-200 rounded flex-1 max-w-[120px] animate-pulse" />
        ))}
      </div>
      {/* Body rows */}
      <div className="divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-5 py-4 animate-pulse">
            {Array.from({ length: columns }).map((_, c) => (
              <div
                key={c}
                className="h-3 bg-gray-100 rounded flex-1 max-w-[120px]"
                style={{ animationDelay: `${(r * columns + c) * 30}ms` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;