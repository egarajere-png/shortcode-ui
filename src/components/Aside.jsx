import React, { useEffect } from 'react';
import UserService from '../services/UserService';
import { Link, useLocation } from 'react-router-dom';

// ─── Navigation config ────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: 'Overview',
    roles: ['apicaller'],
    items: [
      {
        to: '/dashboard', label: 'Dashboard', roles: ['apicaller'],
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Registry',
    roles: ['apicaller'],
    items: [
      {
        to: '/registry', label: 'Shortcode Registry', roles: ['apicaller'],
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Shortcodes',
    roles: ['maker'],
    items: [
      {
        to: '/request', label: 'Request Shortcode', roles: ['maker'],
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ),
      },
      {
        to: '/delete', label: 'Delete Shortcode', roles: ['maker'],
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        ),
      },
      {
        to: '/test-request', label: 'Test Request', roles: ['maker'],
        badge: 'Dev',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Approvals',
    roles: ['checker'],
    items: [
      {
        to: '/pending', label: 'Pending Approvals', roles: ['checker'],
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        to: '/pending-delete', label: 'Pending Deletions', roles: ['checker'],
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Query',
    roles: ['maker', 'checker'],
    items: [
      {
        to: '/query', label: 'Query Shortcode', roles: ['maker', 'checker'],
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
      },
      {
        to: '/query/account', label: 'Query by Account', roles: ['maker', 'checker'],
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'M-Pesa',
    items: [
      {
        to: '/c2b', label: 'Simulate C2B', roles: null,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        ),
      },
      {
        to: '/b2c', label: 'B2C Transfer', roles: null,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        ),
      },
    ],
  },
];

// ─── Single nav item ──────────────────────────────────────────────────────────
function NavItem({ item, isActive, onClick }) {
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
        transition-all duration-150 group relative
        ${isActive
          ? 'bg-[#0055A5] text-white font-semibold shadow-sm shadow-blue-900/30'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Active left bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2
          w-0.5 h-5 bg-blue-300 rounded-r-full" />
      )}

      {/* Icon */}
      <span className={`flex-shrink-0 transition-colors
        ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
        {item.icon}
      </span>

      {/* Label */}
      <span className="flex-1 truncate">{item.label}</span>

      {/* Optional badge */}
      {item.badge && (
        <span className="text-[9px] font-bold uppercase tracking-wide
          bg-purple-500/20 text-purple-300 border border-purple-500/30
          px-1.5 py-0.5 rounded-full flex-shrink-0">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// ─── Sidebar content (shared between desktop & mobile drawer) ─────────────────
function SidebarContent({ location, onNavClick }) {
  const username  = UserService.getUsername();
  const isChecker = UserService.hasRole(['checker']);
  const isMaker   = UserService.hasRole(['maker']);
  const roleLabel = isChecker ? 'Checker' : isMaker ? 'Maker' : 'Staff';

  const roleColors = {
    Checker: 'bg-green-500/20 text-green-300 border-green-500/30',
    Maker:   'bg-blue-500/20  text-blue-300  border-blue-500/30',
    Staff:   'bg-gray-500/20  text-gray-300  border-gray-500/30',
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Brand ──────────────────────────────────────────────────── */}
      <div className="px-4 py-4 border-b border-slate-800 flex-shrink-0">
        <a href="https://abcthebank.com" target="_blank" rel="noreferrer"
          className="flex items-center gap-3 group">
          <img src="/abc-logo.png" alt="ABC Bank" className="h-9 w-auto flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate leading-tight">ABC Bank</p>
            <p className="text-[11px] text-slate-500 truncate">Shortcodes Portal</p>
          </div>
        </a>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6
        scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700"
        aria-label="Main navigation">
        {NAV_SECTIONS.map((section) => {
          if (section.roles && !UserService.hasRole(section.roles)) return null;

          const visible = section.items.filter(
            (item) => !item.roles || UserService.hasRole(item.roles)
          );
          if (visible.length === 0) return null;

          return (
            <div key={section.label}>
              <p className="px-3 mb-2 text-[10px] font-bold uppercase
                tracking-widest text-slate-600">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {visible.map((item) => (
                  <NavItem
                    key={item.to}
                    item={item}
                    isActive={location.pathname === item.to}
                    onClick={onNavClick}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── User profile + actions ──────────────────────────────────── */}
      <div className="border-t border-slate-800 px-3 py-4 flex-shrink-0 space-y-1">
        {/* User info block */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg
          bg-slate-800/50 border border-slate-700/50 mb-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-lg bg-[#0055A5] flex items-center
            justify-center flex-shrink-0 shadow-sm">
            <span className="text-sm font-bold text-white uppercase">
              {username ? username.charAt(0) : 'U'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate">{username}</p>
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold
              px-1.5 py-0.5 rounded border mt-0.5
              ${roleColors[roleLabel] || roleColors.Staff}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Help */}
        <button
          onClick={() => window.open(
            'http://172.16.2.175/otrs/index.pl?Action=AgentFAQZoom;ItemID=10',
            '_blank', 'noopener,noreferrer'
          )}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
            text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200
            transition-all duration-150"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278
              2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Help & Support</span>
        </button>

        {/* Logout */}
        <button
          onClick={() => UserService.doLogout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
            text-sm text-slate-400 hover:bg-red-950/60 hover:text-red-400
            transition-all duration-150 group"
        >
          <svg className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5
            transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

// ─── Aside root ───────────────────────────────────────────────────────────────
function Aside({ mobileOpen, onMobileClose }) {
  const location = useLocation();

  // Close drawer on navigation
  useEffect(() => {
    if (mobileOpen) onMobileClose?.();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Desktop permanent sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0
          bg-slate-900 h-screen sticky top-0"
        aria-label="Sidebar navigation"
      >
        <SidebarContent location={location} />
      </aside>

      {/* Mobile slide-in drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true"
          aria-label="Navigation drawer">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <aside className="relative flex flex-col w-72 h-full bg-slate-900 shadow-2xl">
            {/* Close button */}
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={onMobileClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white
                  hover:bg-slate-700 transition-colors"
                aria-label="Close navigation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarContent location={location} onNavClick={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  );
}

export default Aside;