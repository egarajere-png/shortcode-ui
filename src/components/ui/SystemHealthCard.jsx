import React from 'react';

/**
 * SystemHealthCard
 * Displays the operational status of backend services.
 * All data is static / mocked — informational only.
 * API-ready: pass a `services` prop to replace mock data.
 *
 * Props:
 *   services  array  Optional. [{name, status, latency}]
 *             status: 'healthy' | 'operational' | 'degraded' | 'coming_soon' | 'down'
 */

const STATUS_CONFIG = {
  healthy: {
    label:  'Healthy',
    dot:    'bg-green-500',
    text:   'text-green-700',
    bg:     'bg-green-50',
    border: 'border-green-100',
    pulse:  true,
  },
  operational: {
    label:  'Operational',
    dot:    'bg-green-400',
    text:   'text-green-600',
    bg:     'bg-green-50',
    border: 'border-green-100',
    pulse:  true,
  },
  degraded: {
    label:  'Degraded',
    dot:    'bg-amber-500',
    text:   'text-amber-700',
    bg:     'bg-amber-50',
    border: 'border-amber-100',
    pulse:  false,
  },
  coming_soon: {
    label:  'Coming Soon',
    dot:    'bg-gray-300',
    text:   'text-gray-500',
    bg:     'bg-gray-50',
    border: 'border-gray-100',
    pulse:  false,
  },
  down: {
    label:  'Down',
    dot:    'bg-red-500',
    text:   'text-red-700',
    bg:     'bg-red-50',
    border: 'border-red-100',
    pulse:  false,
  },
};

const MOCK_SERVICES = [
  {
    name:    'Backend API',
    status:  'healthy',
    latency: '42ms',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
  },
  {
    name:    'Database',
    status:  'healthy',
    latency: '8ms',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
  },
  {
    name:    'RabbitMQ',
    status:  'healthy',
    latency: '12ms',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name:    'Email Service',
    status:  'operational',
    latency: '120ms',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name:    'Redis Cache',
    status:  'coming_soon',
    latency: null,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

// Overall system status derived from services
function overallStatus(services) {
  if (services.some((s) => s.status === 'down'))      return { label: 'Degraded',   color: 'text-red-600',   dot: 'bg-red-500'   };
  if (services.some((s) => s.status === 'degraded'))  return { label: 'Degraded',   color: 'text-amber-600', dot: 'bg-amber-500' };
  return                                                     { label: 'All Systems Operational', color: 'text-green-600', dot: 'bg-green-500' };
}

function SystemHealthCard({ services }) {
  const items  = services || MOCK_SERVICES;
  const overall = overallStatus(items);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">System Health</h3>
          <p className="text-xs text-gray-400 mt-0.5">Infrastructure status overview</p>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${overall.color}`}>
          <span className={`w-2 h-2 rounded-full ${overall.dot} animate-pulse`} />
          {overall.label}
        </div>
      </div>

      {/* Services list */}
      <div className="divide-y divide-gray-50">
        {items.map((svc) => {
          const cfg = STATUS_CONFIG[svc.status] || STATUS_CONFIG.operational;
          return (
            <div key={svc.name}
              className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
              {/* Service icon */}
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center
                justify-center flex-shrink-0 text-gray-500">
                {svc.icon}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800">{svc.name}</p>
                {svc.latency && (
                  <p className="text-[10px] text-gray-400 mt-0.5">Latency: {svc.latency}</p>
                )}
              </div>

              {/* Status badge */}
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold
                uppercase tracking-wide px-2.5 py-1 rounded-full border
                ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                  ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`} />
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-[11px] text-gray-400">
          Informational only · Static data ·{' '}
          <span className="text-blue-500">Connect health-check API to enable live monitoring</span>
        </p>
      </div>
    </div>
  );
}

export default SystemHealthCard;
