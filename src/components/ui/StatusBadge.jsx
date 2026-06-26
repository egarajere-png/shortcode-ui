import React from 'react';

// status: 'active' | 'pending' | 'deleted' | 'approved' | 'rejected' | 'warning'
export function StatusBadge({ status, label }) {
  const variants = {
    active:   'bg-green-50 text-green-700 ring-green-200',
    approved: 'bg-green-50 text-green-700 ring-green-200',
    pending:  'bg-amber-50 text-amber-700 ring-amber-200',
    warning:  'bg-amber-50 text-amber-700 ring-amber-200',
    deleted:  'bg-red-50 text-red-700 ring-red-200',
    rejected: 'bg-red-50 text-red-700 ring-red-200',
    info:     'bg-blue-50 text-blue-700 ring-blue-200',
  };

  const dots = {
    active:   'bg-green-500',
    approved: 'bg-green-500',
    pending:  'bg-amber-500',
    warning:  'bg-amber-500',
    deleted:  'bg-red-500',
    rejected: 'bg-red-500',
    info:     'bg-blue-500',
  };

  const key = status?.toLowerCase() || 'info';
  const ringClass = variants[key] || variants.info;
  const dotClass = dots[key] || dots.info;
  const displayLabel = label || (status ? status.charAt(0).toUpperCase() + status.slice(1) : '');

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${ringClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass}`} />
      {displayLabel}
    </span>
  );
}

export default StatusBadge;