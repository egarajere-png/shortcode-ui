import React from "react";
import Sidebar from "./Sidebar";

function MainLayout({ children }) {
  return (
    <div className="flex">

      <Sidebar />

      <main className="flex-1 bg-gray-100 p-6 min-h-screen">
        {children}
      </main>

    </div>
  );
}

export default MainLayout;