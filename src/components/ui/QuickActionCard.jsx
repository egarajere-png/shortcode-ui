import React from 'react';
import { Link } from 'react-router-dom';

/**
 * QuickActionCard
 * Compact, icon-led action tile for the Quick Actions section.
 * Always navigates — wraps in a React Router Link.
 *
 * Props:
 *   label      string   Action name
 *   to         string   Route path
 *   icon       node     SVG icon
 *   iconBg     string   Tailwind bg class
 *   iconColor  string   Tailwind text class
 *   badge      string   Optional pill (e.g. "15" for pending count)
 *   badgeColor string   Tailwind bg+text classes for badge
 *   restricted bool     If true renders greyed out (for role-gated items shown to wrong role)
 */
function QuickActionCard({
  label,
  to,
  icon,
  iconBg    = 'bg-blue-50',
  iconColor = 'text-blue-700',
  badge,
  badgeColor = 'bg-amber-100 text-amber-700',
  restricted = false,
}) {
  const content = (
    <div className={`
      relative bg-white rounded-xl border border-gray-200 p-5
      flex flex-col items-center gap-3 text-center
      transition-all duration-200 group
      ${restricted
        ? 'opacity-40 cursor-not-allowed'
        : 'hover:shadow-md hover:-translate-y-0.5 hover:border-blue-200 cursor-pointer'}
    `}>
      {/* Badge */}
      {badge && (
        <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold
          px-1.5 py-0.5 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      )}

      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center
        transition-transform duration-200 group-hover:scale-110`}>
        <div className={`w-6 h-6 ${iconColor}`}>{icon}</div>
      </div>

      {/* Label */}
      <span className="text-sm font-semibold text-gray-700 leading-tight">{label}</span>
    </div>
  );

  if (restricted) return content;
  return <Link to={to} className="block">{content}</Link>;
}

export default QuickActionCard;
