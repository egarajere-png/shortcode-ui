import React, { useState } from 'react';
import Aside from './Aside';
import Footer from './Footer';
import Menu from './Menu';

/**
 * ComponentWithAsideBar
 * Root layout wrapper.
 * Manages mobile drawer open/close state and passes it to both
 * Menu (for hamburger animation) and Aside (for drawer visibility).
 */
function ComponentWithAsideBar({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Mobile top bar — hidden on lg+ */}
      <Menu
        onMobileMenuToggle={() => setMobileOpen((v) => !v)}
        menuOpen={mobileOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Aside
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* Page content */}
        <main className="flex-1 flex flex-col overflow-auto min-w-0">
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default ComponentWithAsideBar;