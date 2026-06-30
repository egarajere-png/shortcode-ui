import React, { useState, useEffect, useCallback } from 'react';
// import { Route, Routes, Navigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import UserService from '../services/UserService';
import RenderOnRole from './access/RenderOnRole';

// UI primitives
import DashboardSection  from './ui/DashboardSection';
import AnalyticsCard     from './ui/AnalyticsCard';
import QuickActionCard   from './ui/QuickActionCard';
import ActivityTimeline  from './ui/ActivityTimeline';
import NotificationBell  from './ui/NotificationBell';
import MiniBarChart      from './ui/MiniBarChart';
import SystemHealthCard  from './ui/SystemHealthCard';
import DashboardService from "../services/DashboardService";

// ─── helpers ─────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(d) {
  return d.toLocaleDateString('en-KE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function formatTime(d) {
  return d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ─── Live clock ───────────────────────────────────────────────────────────────
function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// ─── Icon helpers (kept inline to avoid extra files) ─────────────────────────
const Icon = {
  shortcode: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  pending: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  trash: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  today: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  plus: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  search: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  user: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  check: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  audit: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  test: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  exchange: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  card: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  warning: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
};

// ─── Greeting banner ──────────────────────────────────────────────────────────
function GreetingBanner({ username, roleLabel, now }) {
  return (
    <div className="relative overflow-hidden rounded-xl mb-6
      bg-gradient-to-br from-[#003A70] via-[#004A8A] to-[#0055A5]">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }} />

      {/* Decorative arc */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full
        bg-white/5 pointer-events-none" />
      <div className="absolute -right-8 -bottom-20 w-48 h-48 rounded-full
        bg-white/5 pointer-events-none" />

      <div className="relative px-6 py-6 flex flex-col sm:flex-row
        sm:items-center sm:justify-between gap-5">
        {/* Left: greeting */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20
            flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-white uppercase">
              {username ? username.charAt(0) : 'U'}
            </span>
          </div>
          <div>
            <p className="text-blue-200 text-sm font-medium">{getGreeting()},</p>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {username || 'User'}
            </h1>
            <p className="text-blue-300 text-xs mt-0.5">{formatDate(now)}</p>
          </div>
        </div>

        {/* Right: meta chips */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Role */}
          <div className="flex items-center gap-2 bg-white/10 border border-white/20
            rounded-lg px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            <span className="text-xs font-semibold text-blue-100">
              Role: <span className="text-white">{roleLabel}</span>
            </span>
          </div>

          {/* Live clock */}
          <div className="flex items-center gap-2 bg-white/10 border border-white/20
            rounded-lg px-3 py-2">
            <svg className="w-3.5 h-3.5 text-blue-300 flex-shrink-0" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-mono text-white tabular-nums">
              {formatTime(now)}
            </span>
          </div>

          {/* Online status */}
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30
            rounded-lg px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            <span className="text-xs font-semibold text-green-300">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
function Dashboard() {
  const now       = useClock();
  const username  = UserService.getUsername();
  const isChecker = UserService.hasRole(['checker']);
  const isMaker   = UserService.hasRole(['maker']);
  const roleLabel = isChecker ? 'Checker' : isMaker ? 'Maker' : 'Staff';
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  

  useEffect(() => {

    DashboardService.getAnalytics()
        .then((response) => {
           console.log("Dashboard Analytics:", response.data);
           setAnalytics(response.data);
        })
        .catch((error) => {
            console.error("Failed to load dashboard analytics", error);
        })
        .finally(() => {
            setLoadingAnalytics(false);
        });

}, []);

  return (
    <div>
      {/* ── Greeting banner ───────────────────────────────────────── */}
      <GreetingBanner username={username} roleLabel={roleLabel} now={now} />

      {/* ── KPI statistics ────────────────────────────────────────── */}
      <DashboardSection title="Statistics Overview">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard
            title="Approved Shortcodes"
            value={analytics?.activeShortcodes ?? 0}
            subtitle="Total active shortcodes"
            trend={`${analytics?.approvalRate ?? 0}% approval`}
            trendDirection="up"
            iconBg="bg-blue-50"
            iconColor="text-[#003A70]"
            icon={Icon.shortcode}
            loading={loadingAnalytics}
            to="/registry/active"
          />
          <AnalyticsCard
            title="Pending Requests"
            value={analytics?.pendingApprovals ?? 0}
            subtitle="Awaiting checker approval"
            trend="Awaiting approval"
            trendDirection="neutral"
            iconBg="bg-amber-50"
            iconColor="text-amber-700"
            icon={Icon.pending}
            loading={loadingAnalytics}
          />
          <AnalyticsCard
            title="Pending Deletions"
            value={analytics?.pendingDeletions ?? 0}
            subtitle="Awaiting deletion approval"
            trend="Awaiting deletion"
            trendDirection="neutral"
            iconBg="bg-red-50"
            iconColor="text-red-700"
            icon={Icon.trash}
            loading={loadingAnalytics}
          />
          <AnalyticsCard
            title="Today's Requests"
            value={analytics?.todayRequests ?? 0}
            subtitle="Shortcode requests today"
            trend="Total Requests"
            trendDirection="up"
            iconBg="bg-indigo-50"
            iconColor="text-indigo-700"
            icon={Icon.today}
            loading={loadingAnalytics}
          />
        </div>
      </DashboardSection>

      {/* ── Quick actions ─────────────────────────────────────────── */}
      <DashboardSection
        title="Quick Actions"
        action={
          <span className="text-[11px] text-gray-400">
            Role-based access applies
          </span>
        }
      >
        {/* Maker actions */}
        <RenderOnRole roles={['maker']}>
          <div className="mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest
              text-gray-300 mb-2 ml-0.5">
              Maker
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <QuickActionCard
                label="Request Shortcode"
                to="/request"
                icon={Icon.plus}
                iconBg="bg-blue-50"
                iconColor="text-[#003A70]"
              />
              <QuickActionCard
                label="Delete Shortcode"
                to="/delete"
                icon={Icon.trash}
                iconBg="bg-red-50"
                iconColor="text-red-600"
              />
              <QuickActionCard
                label="Test Request"
                to="/test-request"
                icon={Icon.test}
                iconBg="bg-purple-50"
                iconColor="text-purple-600"
                badge="Dev"
                badgeColor="bg-purple-100 text-purple-700"
              />
            </div>
          </div>
        </RenderOnRole>

        {/* Checker actions */}
        <RenderOnRole roles={['checker']}>
          <div className="mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest
              text-gray-300 mb-2 ml-0.5">
              Checker
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <QuickActionCard
                label="Pending Approvals"
                to="/pending"
                icon={Icon.check}
                iconBg="bg-amber-50"
                iconColor="text-amber-600"
                badge={analytics?.pendingApprovals ?? 0}
                badgeColor="bg-amber-100 text-amber-800"
              />
              <QuickActionCard
                label="Pending Deletions"
                to="/pending-delete"
                icon={Icon.warning}
                iconBg="bg-orange-50"
                iconColor="text-orange-600"
                badge={analytics?.pendingDeletions ?? 0}
                badgeColor="bg-orange-100 text-orange-800"
              />
            </div>
          </div>
        </RenderOnRole>

        {/* Shared actions — all roles */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest
            text-gray-300 mb-2 ml-0.5">
            Query & Audit
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <QuickActionCard
              label="Query Shortcode"
              to="/query"
              icon={Icon.search}
              iconBg="bg-blue-50"
              iconColor="text-blue-700"
            />
            <QuickActionCard
              label="Query Customer"
              to="/query/account"
              icon={Icon.user}
              iconBg="bg-indigo-50"
              iconColor="text-indigo-700"
            />
            <QuickActionCard
              label="Simulate C2B"
              to="/c2b"
              icon={Icon.exchange}
              iconBg="bg-green-50"
              iconColor="text-green-700"
            />
            <QuickActionCard
              label="B2C Transfer"
              to="/b2c"
              icon={Icon.card}
              iconBg="bg-teal-50"
              iconColor="text-teal-700"
            />
          </div>
        </div>
      </DashboardSection>

      {/* ── Main content grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Activity timeline — spans 2 cols */}
        <div className="lg:col-span-2">
          <ActivityTimeline />
        </div>

        {/* Notifications preview */}
        <div>
          <NotificationsPanel />
        </div>
      </div>

      {/* ── Bottom grid: chart + health ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <MiniBarChart />
        <SystemHealthCard />
      </div>
    </div>    
  );
}

// ─── Notifications panel (inline preview widget) ──────────────────────────────
const PANEL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'approval',
    title: 'Shortcode Awaiting Approval',
    body: 'Request for Equity Traders Sacco is pending review.',
    time: '5 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'approved',
    title: 'Shortcode Approved',
    body: 'Shortcode 350001 for KCB Holdings Ltd approved.',
    time: '22 min ago',
    read: false,
  },
  {
    id: 3,
    type: 'deletion',
    title: 'Deletion Request Pending',
    body: 'Deletion for shortcode 350120 awaits checker approval.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 4,
    type: 'system',
    title: 'Scheduled Maintenance',
    body: 'Maintenance scheduled Saturday 29 Jun at 02:00 EAT.',
    time: '3 hr ago',
    read: true,
  },
];

const NOTIF_TYPE = {
  approval: { dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
  approved: { dot: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700' },
  deletion: { dot: 'bg-red-500',   bg: 'bg-red-50',   text: 'text-red-700'   },
  system:   { dot: 'bg-blue-500',  bg: 'bg-blue-50',  text: 'text-blue-700'  },
};

function NotificationsPanel() {
  const [items, setItems] = useState(PANEL_NOTIFICATIONS);
  const unread = items.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {unread > 0 ? `${unread} unread` : 'All caught up'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <span className="w-5 h-5 flex items-center justify-center text-[10px]
              font-bold text-white bg-red-500 rounded-full">
              {unread}
            </span>
          )}
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-blue-600 hover:text-blue-800
                hover:underline transition-colors font-medium"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {items.map((item) => {
          const cfg = NOTIF_TYPE[item.type] || NOTIF_TYPE.system;
          return (
            <div
              key={item.id}
              onClick={() => setItems((prev) =>
                prev.map((n) => n.id === item.id ? { ...n, read: true } : n)
              )}
              className={`flex gap-3 px-5 py-3.5 cursor-pointer transition-colors
                hover:bg-gray-50 ${!item.read ? 'bg-blue-50/30' : ''}`}
            >
              {/* Dot indicator */}
              <div className="pt-1 flex-shrink-0">
                <span className={`w-2 h-2 rounded-full block flex-shrink-0
                  ${item.read ? 'bg-gray-200' : cfg.dot}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold leading-tight
                  ${item.read ? 'text-gray-500' : 'text-gray-900'}`}>
                  {item.title}
                </p>
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
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex-shrink-0">
        <p className="text-[11px] text-gray-400 text-center">
          Mocked data ·{' '}
          <span className="text-blue-500">Connect notification API</span>
        </p>
      </div>
    </div>
  );
}

export default Dashboard;