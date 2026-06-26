import React, { useMemo } from 'react';

/**
 * MiniBarChart
 * Pure React + SVG weekly bar chart. Zero external dependencies.
 * API-ready: replace MOCK_DATA by passing a `data` prop.
 *
 * Props:
 *   data         array    [{day: 'Mon', value: 12}, ...]  Optional, uses mock if omitted
 *   height       number   SVG height in px (default 120)
 *   barColor     string   Tailwind fill class or hex (default #0055A5)
 *   accentColor  string   Highlight bar color (today's bar)
 *   label        string   Chart label shown above
 *   sublabel     string   Secondary label
 */

const MOCK_DATA = [
  { day: 'Mon', value: 18 },
  { day: 'Tue', value: 24 },
  { day: 'Wed', value: 31 },
  { day: 'Thu', value: 19 },
  { day: 'Fri', value: 27 },
  { day: 'Sat', value: 8  },
  { day: 'Sun', value: 5  },
];

// Today's index (0=Sun → remap to Mon-first)
const todayIndex = (() => {
  const d = new Date().getDay(); // 0=Sun
  return d === 0 ? 6 : d - 1;   // convert to Mon=0 … Sun=6
})();

function MiniBarChart({
  data        = MOCK_DATA,
  height      = 120,
  barColor    = '#0055A5',
  accentColor = '#003A70',
  label       = 'Weekly Shortcode Requests',
  sublabel    = 'Current week · Mocked data',
}) {
  const svgPadding = { top: 12, right: 8, bottom: 28, left: 8 };
  const barGap     = 6;

  const total  = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  const maxVal = useMemo(() => Math.max(...data.map((d) => d.value), 1),  [data]);

  // Computed in render — safe for any container width via viewBox
  const viewWidth   = 280;
  const chartWidth  = viewWidth - svgPadding.left - svgPadding.right;
  const chartHeight = height - svgPadding.top - svgPadding.bottom;
  const barWidth    = (chartWidth - barGap * (data.length - 1)) / data.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#003A70]">{total}</p>
          <p className="text-xs text-gray-400">total this week</p>
        </div>
      </div>

      {/* SVG bar chart */}
      <svg
        viewBox={`0 0 ${viewWidth} ${height}`}
        className="w-full"
        aria-label={`Bar chart: ${label}`}
        role="img"
      >
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const y = svgPadding.top + chartHeight * (1 - frac);
          return (
            <line
              key={frac}
              x1={svgPadding.left}
              y1={y}
              x2={viewWidth - svgPadding.right}
              y2={y}
              stroke="#F1F5F9"
              strokeWidth="1"
            />
          );
        })}

        {/* Bars + labels */}
        {data.map((item, i) => {
          const barH   = (item.value / maxVal) * chartHeight;
          const x      = svgPadding.left + i * (barWidth + barGap);
          const y      = svgPadding.top + (chartHeight - barH);
          const isToday = i === todayIndex;
          const fill   = isToday ? accentColor : barColor;
          const opacity = isToday ? 1 : 0.65;

          return (
            <g key={item.day}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx={3}
                fill={fill}
                opacity={opacity}
                className="transition-all duration-300"
              >
                <title>{item.day}: {item.value} requests</title>
              </rect>

              {/* Value above bar (only if bar tall enough) */}
              {barH > 18 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 3}
                  textAnchor="middle"
                  fontSize="8"
                  fill={isToday ? accentColor : '#64748B'}
                  fontWeight={isToday ? '700' : '500'}
                >
                  {item.value}
                </text>
              )}

              {/* Day label */}
              <text
                x={x + barWidth / 2}
                y={height - 6}
                textAnchor="middle"
                fontSize="9"
                fill={isToday ? accentColor : '#94A3B8'}
                fontWeight={isToday ? '700' : '400'}
              >
                {item.day}
              </text>

              {/* Today indicator dot */}
              {isToday && (
                <circle
                  cx={x + barWidth / 2}
                  cy={height - 16}
                  r={2}
                  fill={accentColor}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-end gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: barColor, opacity: 0.65 }} />
          <span className="text-[10px] text-gray-400">Previous days</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: accentColor }} />
          <span className="text-[10px] text-gray-400">Today</span>
        </div>
      </div>
    </div>
  );
}

export default MiniBarChart;
