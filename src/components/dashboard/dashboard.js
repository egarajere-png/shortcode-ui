import React from "react";

function Dashboard() {
  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Shortcode Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white shadow rounded p-6">
          <h3 className="text-gray-500">
            Pending Requests
          </h3>
          <p className="text-3xl font-bold">
            --
          </p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h3 className="text-gray-500">
            Approved Shortcodes
          </h3>
          <p className="text-3xl font-bold">
            --
          </p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h3 className="text-gray-500">
            Pending Deletes
          </h3>
          <p className="text-3xl font-bold">
            --
          </p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;