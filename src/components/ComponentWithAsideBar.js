import React, { useState } from 'react';
import Aside from './Aside';
import Footer from './Footer';
import Menu from './Menu';

function ComponentWithAsideBar({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile top bar */}
      <Menu onMobileMenuToggle={() => setMobileOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (desktop permanent, mobile drawer) */}
        <Aside
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* Main content */}
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