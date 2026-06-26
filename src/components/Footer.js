import React from 'react';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-gray-400">
          © {year} ABC Bank. Shortcodes Management Portal. All rights reserved.
        </p>
        <p className="text-xs text-gray-400">
          Internal use only — Authorised personnel only
        </p>
      </div>
    </footer>
  );
}

export default Footer;