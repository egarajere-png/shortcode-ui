import React from 'react';

/**
 * ActivityTimeline
 * Displays a vertical list of recent system events.
 * Currently uses mocked data.
 * API-ready: replace MOCK_ACTIVITIES with live data by passing an `activities` prop.
 *
 * Props:
 *   activities   array    Optional. If not passed, uses internal mock data.
 *   maxItems     number   Max entries to render (default 6)
 */

const ACTION_CONFIG = {
  INITIATED: {
    dot:   'bg-blue-500',
    ring:  'ring-blue-100',
    label: 'bg-blue-50 text-blue-700 border-blue-100',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  APPROVED: {
    dot:   'bg-green-500',
    ring:  'ring-green-100',
    label: 'bg-green-50 text-green-700 border-green-100',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  DELETE_REQUESTED: {
    dot:   'bg-amber-500',
    ring:  'ring-amber-100',
    label: 'bg-amber-50 text-amber-700 border-amber-100',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
  },
  DELETE_APPROVED: {
    dot:   'bg-red-500',
    ring:  'ring-red-100',
    label: 'bg-red-50 text-red-700 border-red-100',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
};

const MOCK_ACTIVITIES = [
  {
    id: 1,
    action: 'APPROVED',
    shortCode: '350001',
    user: 'jane.checker',
    timestamp: '2 minutes ago',
    description: 'Shortcode 350001 approved for account 0012345678',
  },
  {
    id: 2,
    action: 'INITIATED',
    shortCode: '350042',
    user: 'mary.maker',
    timestamp: '18 minutes ago',
    description: 'New shortcode request initiated for KCB Holdings Ltd',
  },
  {
    id: 3,
    action: 'DELETE_REQUESTED',
    shortCode: '350120',
    user: 'john.maker',
    timestamp: '1 hour ago',
    description: 'Deletion requested for shortcode 350120 — account closed',
  },
  {
    id: 4,
    action: 'DELETE_APPROVED',
    shortCode: '350098',
    user: 'jane.checker',
    timestamp: '2 hours ago',
    description: 'Deletion of shortcode 350098 approved and processed',
  },
  {
    id: 5,
    action: 'INITIATED',
    shortCode: '350205',
    user: 'david.operations',
    timestamp: '3 hours ago',
    description: 'Shortcode request initiated for Equity Traders Sacco',
  },
  {
    id: 6,
    action: 'APPROVED',
    shortCode: '350180',
    user: 'supervisor.admin',
    timestamp: '5 hours ago',
    description: 'Shortcode 350180 approved — Safaricom Business Ltd',
  },
];

function ActivityTimeline({ activities, maxItems = 6 }) {
  const items = (activities || MOCK_ACTIVITIES).slice(0, maxItems);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-xs text-gray-400 mt-0.5">Latest shortcode events across the system</p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wide
          bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
          Mocked
        </span>
      </div>

      {/* Timeline */}
      <div className="divide-y divide-gray-50">
        {items.map((item, index) => {
          const config = ACTION_CONFIG[item.action] || ACTION_CONFIG.INITIATED;
          const isLast = index === items.length - 1;

          return (
            <div key={item.id} className="flex gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
              {/* Dot + spine */}
              <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center
                  ring-4 ${config.dot} ${config.ring} text-white shadow-sm`}>
                  {config.icon}
                </div>
                {!isLast && <div className="w-px flex-1 bg-gray-100 mt-2" />}
              </div>

              {/* Content */}
              <div className={`flex-1 min-w-0 ${!isLast ? 'pb-2' : ''}`}>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider
                    px-2 py-0.5 rounded border ${config.label}`}>
                    {item.action.replace('_', ' ')}
                  </span>
                  {item.shortCode && (
                    <span className="text-xs font-mono font-semibold text-gray-700">
                      #{item.shortCode}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-1">
                  {item.description}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-400">
                    by <span className="font-medium text-gray-600">{item.user}</span>
                  </span>
                  <span className="text-[11px] text-gray-300">·</span>
                  <span className="text-[11px] text-gray-400">{item.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-[11px] text-gray-400 text-center">
          Showing {items.length} most recent events
          <span className="mx-1.5">·</span>
          <span className="text-blue-600 cursor-pointer hover:underline">
            Connect live data via audit API
          </span>
        </p>
      </div>
    </div>
  );
}

export default ActivityTimeline;
