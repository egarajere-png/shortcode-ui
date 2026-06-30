import React, { useState } from 'react';
import UserService from '../services/UserService';
import NotificationBell from './ui/NotificationBell';

/**
 * Menu
 * Mobile-only top navigation bar (hidden on lg+).
 * Improvements:
 *   - Cleaner hamburger with animated X transition
 *   - ABC Bank logo + portal name
 *   - NotificationBell with dropdown
 *   - Better avatar with initials
 *   - Proper aria labels for accessibility
 */
function Menu({ onMobileMenuToggle, menuOpen = false }) {
  const username = UserService.getUsername();

  return (
    <header
      className="lg:hidden sticky top-0 z-30 flex items-center justify-between
        h-14 px-4 bg-slate-900 border-b border-slate-800 shadow-lg"
      role="banner"
    >
      {/* Hamburger */}
      <button
        onClick={onMobileMenuToggle}
        className="p-2 rounded-lg text-slate-400 hover:text-white
          hover:bg-slate-700 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
      >
        <div className="w-5 h-5 flex flex-col justify-center gap-1.5 relative">
          {/* Top bar */}
          <span className={`block h-0.5 bg-current rounded-full transition-all duration-300
            ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          {/* Middle bar */}
          <span className={`block h-0.5 bg-current rounded-full transition-all duration-300
            ${menuOpen ? 'opacity-0 -translate-x-2' : ''}`} />
          {/* Bottom bar */}
          <span className={`block h-0.5 bg-current rounded-full transition-all duration-300
            ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </div>
      </button>

      {/* Brand */}
      <a
        href="https://abcthebank.com"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2"
        aria-label="ABC Bank — Shortcodes Portal home"
      >
        <img
          src="/abc-logo.png"
          alt="ABC Bank"
          className="h-7 w-auto"
        />
        <span className="text-sm font-semibold text-white whitespace-nowrap hidden xs:block">
          Shortcodes Portal
        </span>
      </a>

      {/* Right controls */}
      <div className="flex items-center gap-1">
        {/* Notification bell */}
        <NotificationBell />

        {/* User avatar */}
        <div
          className="w-8 h-8 rounded-lg bg-[#0055A5] flex items-center
            justify-center ml-1 flex-shrink-0 border border-blue-700/50"
          title={username}
          aria-label={`Logged in as ${username}`}
        >
          <span className="text-xs font-bold text-white uppercase select-none">
            {username ? username.charAt(0) : 'U'}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Menu;