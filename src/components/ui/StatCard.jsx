import React from 'react';
import { Link } from 'react-router-dom';

/**
 * StatCard  (extended — 100% backward compatible)
 *
 * EXISTING props (unchanged behaviour):
 *   title        string   Card heading
 *   description  string   Subtitle / helper text
 *   to           string   React Router link target
 *   colorClass   string   Tailwind text color for icon & value
 *   bgClass      string   Tailwind bg color for icon container
 *   icon         node     Icon element
 *
 * NEW optional props (used by redesigned Dashboard only):
 *   value          string|number   Large KPI number shown above title
 *   trend          string          e.g. "+12%" or "-3%"
 *   trendDirection 'up'|'down'|'neutral'
 *   badge          string          Small pill label  e.g. "Live"
 *   loading        bool            Shows skeleton shimmer instead of content
 *   footer         node            Arbitrary content below the card body
 */
function StatCard({
  // legacy props
  title,
  description,
  to,
  colorClass = 'text-blue-700',
  bgClass    = 'bg-blue-50',
  icon,
  // new props
  value,
  trend,
  trendDirection = 'neutral',
  badge,
  loading = false,
  footer,
}) {
  const trendColors = {
    up:      'text-green-600 bg-green-50',
    down:    'text-red-600 bg-red-50',
    neutral: 'text-gray-500 bg-gray-100',
  };

  const trendIcons = {
    up: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
    ),
    down: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    neutral: null,
  };

  // ── Loading skeleton ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-lg ${bgClass} opacity-40`} />
        </div>
        <div className="h-7 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-2/3 mb-1" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    );
  }

  // ── Card body ─────────────────────────────────────────────────────
  const body = (
    <div className={`
      bg-white rounded-xl border border-gray-200 p-5
      hover:shadow-md hover:-translate-y-0.5
      transition-all duration-200 group h-full flex flex-col
    `}>
      {/* Top row: icon + chevron / badge */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${bgClass}`}>
          <div className={`w-5 h-5 ${colorClass}`}>{icon}</div>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-[10px] font-bold uppercase tracking-wide
              bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
              {badge}
            </span>
          )}
          {trend && (
            <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold
              px-2 py-0.5 rounded-full ${trendColors[trendDirection]}`}>
              {trendIcons[trendDirection]}
              {trend}
            </span>
          )}
          {to && !trend && !badge && (
            <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </div>

      {/* KPI value */}
      {value !== undefined && value !== null && (
        <div className={`text-3xl font-bold tracking-tight ${colorClass} mb-1`}>
          {value}
        </div>
      )}

      {/* Title */}
      <div className="text-sm font-semibold text-gray-900 mb-1">{title}</div>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-500 mt-auto leading-relaxed">{description}</p>
      )}

      {/* Footer slot */}
      {footer && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );

  if (to) return <Link to={to} className="block h-full">{body}</Link>;
  return body;
}

export default StatCard;