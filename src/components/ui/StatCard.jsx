import React from 'react';
import { Link } from 'react-router-dom';

export function StatCard({ title, value, description, icon, to, colorClass = 'text-blue-600', bgClass = 'bg-blue-50' }) {
  const content = (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200 group h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${bgClass}`}>
          <div className={`w-5 h-5 ${colorClass}`}>
            {icon}
          </div>
        </div>
        {to && (
          <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
      {/* value slot — pass null to show just a nav card */}
      {value !== undefined && value !== null && (
        <div className={`text-3xl font-bold ${colorClass} mb-1`}>{value}</div>
      )}
      <div className="text-sm font-semibold text-gray-900 mb-1">{title}</div>
      {description && (
        <p className="text-xs text-gray-500 mt-auto">{description}</p>
      )}
    </div>
  );

  if (to) {
    return <Link to={to} className="block h-full">{content}</Link>;
  }
  return content;
}

export default StatCard;