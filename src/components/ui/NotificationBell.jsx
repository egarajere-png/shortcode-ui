import React, { useState, useRef, useEffect } from 'react';

/**
 * NotificationBell
 * Notification bell icon with badge count and dropdown panel.
 * Currently uses mocked notifications.
 * API-ready: pass a `notifications` prop to replace mock data.
 *
 * Props:
 *   notifications  array    Optional live notifications array
 *   onMarkAllRead  func     Optional callback when "Mark all read" is clicked
 */

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'approval',
    title: 'Shortcode Awaiting Approval',
    body: 'Shortcode request for Equity Traders Sacco is pending your review.',
    time: '5 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'approved',
    title: 'Shortcode Approved',
    body: 'Shortcode 350001 for KCB Holdings Ltd has been approved by jane.checker.',
    time: '22 min ago',
    read: false,
  },
  {
    id: 3,
    type: 'deletion',
    title: 'Deletion Request Pending',
    body: 'Deletion request for shortcode 350120 is awaiting checker approval.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 4,
    type: 'system',
    title: 'Scheduled Maintenance',
    body: 'System maintenance is scheduled for Saturday 29 Jun 2026 at 02:00 EAT.',
    time: '3 hr ago',
    read: true,
  },
  {
    id: 5,
    type: 'approved',
    title: 'Shortcode Approved',
    body: 'Shortcode 350042 has been successfully activated.',
    time: 'Yesterday',
    read: true,
  },
];

const TYPE_CONFIG = {
  approval: {
    dot:  'bg-amber-500',
    icon: (
      <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bg: 'bg-amber-50',
  },
  approved: {
    dot:  'bg-green-500',
    icon: (
      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    bg: 'bg-green-50',
  },
  deletion: {
    dot:  'bg-red-500',
    icon: (
      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    bg: 'bg-red-50',
  },
  system: {
    dot:  'bg-blue-500',
    icon: (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bg: 'bg-blue-50',
  },
};

function NotificationBell({ notifications, onMarkAllRead }) {
  const [open, setOpen]             = useState(false);
  const [items, setItems]           = useState(notifications || MOCK_NOTIFICATIONS);
  const ref                         = useRef(null);

  const unreadCount = items.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    onMarkAllRead?.();
  };

  const markRead = (id) => {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg text-slate-400 hover:text-white
          hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2
          focus:ring-blue-500"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center
            text-[9px] font-bold text-white bg-red-500 rounded-full border border-slate-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl
          border border-gray-200 z-50 overflow-hidden">
          {/* Dropdown header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-900">Notifications</p>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-400">{unreadCount} unread</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-blue-600 hover:text-blue-800
                  hover:underline transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {items.map((item) => {
              const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.system;
              return (
                <div
                  key={item.id}
                  onClick={() => markRead(item.id)}
                  className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors
                    hover:bg-gray-50 ${!item.read ? 'bg-blue-50/40' : ''}`}
                >
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center
                    justify-center flex-shrink-0 mt-0.5`}>
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs font-semibold leading-tight
                        ${item.read ? 'text-gray-600' : 'text-gray-900'}`}>
                        {item.title}
                      </p>
                      {!item.read && (
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${cfg.dot}`} />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                      {item.body}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400">
              Mocked data ·{' '}
              <span className="text-blue-500">Connect live notification API</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
