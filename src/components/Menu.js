import React from 'react';
import UserService from '../services/UserService';

function Menu({ onMobileMenuToggle }) {
  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-slate-900 border-b border-slate-700">
      {/* Hamburger — opens sidebar drawer on mobile */}
      <button
        onClick={onMobileMenuToggle}
        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        aria-label="Open navigation menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Brand — shows ABC logo + portal name on mobile bar */}
      <a
        href="https://abcthebank.com"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2"
      >
        <img src="/abc-logo.png" className="h-8 w-auto" alt="ABC Bank logo" />
        <span className="text-sm font-semibold text-white whitespace-nowrap">
          Shortcodes Portal
        </span>
      </a>

      {/* User avatar */}
      <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
        <span className="text-xs font-bold text-white uppercase">
          {UserService.getUsername() ? UserService.getUsername().charAt(0) : 'U'}
        </span>
      </div>
    </header>
  );
}

export default Menu;