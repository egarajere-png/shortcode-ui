import React from 'react';

export function StatusBadge({ status, label }) {

  const normalized = status
    ?.toLowerCase()
    .replace(/\s+/g, '-');

  const variants = {
    active: 'bg-green-50 text-green-700 ring-green-200',

    approved: 'bg-green-50 text-green-700 ring-green-200',

    'pending-approval':
      'bg-yellow-50 text-yellow-700 ring-yellow-200',

    pending:
      'bg-yellow-50 text-yellow-700 ring-yellow-200',

    'pending-deletion':
      'bg-orange-50 text-orange-700 ring-orange-200',

    deleted:
      'bg-red-50 text-red-700 ring-red-200',

    rejected:
      'bg-red-50 text-red-700 ring-red-200',

    warning:
      'bg-orange-50 text-orange-700 ring-orange-200',

    info:
      'bg-blue-50 text-blue-700 ring-blue-200',
  };

  const dots = {
    active: 'bg-green-500',

    approved: 'bg-green-500',

    'pending-approval':
      'bg-yellow-500',

    pending:
      'bg-yellow-500',

    'pending-deletion':
      'bg-orange-500',

    deleted:
      'bg-red-500',

    rejected:
      'bg-red-500',

    warning:
      'bg-orange-500',

    info:
      'bg-blue-500',
  };

  const ringClass = variants[normalized] || variants.info;
  const dotClass = dots[normalized] || dots.info;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${ringClass}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass}`}
      />

      {label || status}
    </span>
  );
}

export default StatusBadge;