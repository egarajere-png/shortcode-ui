import React from 'react';

/**
 * AnalyticsCard
 * High-prominence metric card for the top statistics row.
 * Distinct from StatCard: no navigation, focused on a single number + context.
 *
 * Props:
 *   title          string
 *   value          string | number
 *   subtitle       string           Small context line below value
 *   icon           node
 *   iconBg         string           Tailwind bg class for icon container
 *   iconColor      string           Tailwind text class for icon
 *   trend          string           e.g. "+12 this week"
 *   trendDirection 'up'|'down'|'neutral'
 *   loading        bool
 */
function AnalyticsCard({
  title,
  value,
  subtitle,
  icon,
  iconBg    = 'bg-blue-50',
  iconColor = 'text-blue-700',
  trend,
  trendDirection = 'neutral',
  loading = false,
}) {
  const trendStyles = {
    up:      { text: 'text-green-600', bg: 'bg-green-50', arrow: '↑' },
    down:    { text: 'text-red-600',   bg: 'bg-red-50',   arrow: '↓' },
    neutral: { text: 'text-gray-500',  bg: 'bg-gray-50',  arrow: '—' },
  };
  const ts = trendStyles[trendDirection] || trendStyles.neutral;

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-lg ${iconBg} opacity-40`} />
        </div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5
      hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${iconBg}`}>
          <div className={`w-5 h-5 ${iconColor}`}>{icon}</div>
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold
            px-2.5 py-1 rounded-full ${ts.bg} ${ts.text}`}>
            <span>{ts.arrow}</span>
            {trend}
          </span>
        )}
      </div>

      {/* Value */}
      <p className={`text-3xl font-bold tracking-tight ${iconColor} mb-1`}>{value}</p>

      {/* Title */}
      <p className="text-sm font-semibold text-gray-800">{title}</p>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

export default AnalyticsCard;
