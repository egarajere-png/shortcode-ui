import React from "react";
import { Link } from "react-router-dom";
import RenderOnRole from "./access/RenderOnRole";

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold">
          ABC Shortcodes
        </h2>
      </div>

      <nav className="p-4">
    <ul className="space-y-3">

        {/* Dashboard */}
        <RenderOnRole roles={["apicaller"]}>
            <li>
                <Link to="/dashboard" className="block hover:text-blue-400">
                    Dashboard
                </Link>
            </li>
        </RenderOnRole>

        {/* Maker */}
        <RenderOnRole roles={["maker", "apicaller"]}>
            <li>
                <Link to="/request" className="block hover:text-blue-400">
                    Request Shortcode
                </Link>
            </li>

            <li>
                <Link to="/delete" className="block hover:text-blue-400">
                    Delete Shortcode
                </Link>
            </li>
        </RenderOnRole>

        {/* Checker */}
        <RenderOnRole roles={["checker", "apicaller"]}>
            <li>
                <Link to="/pending" className="block hover:text-blue-400">
                    Pending Requests
                </Link>
            </li>

            <li>
                <Link to="/pending-delete" className="block hover:text-blue-400">
                    Pending Deletes
                </Link>
            </li>

            <li>
                <Link to="/approved" className="block hover:text-blue-400">
                    Approved Requests
                </Link>
            </li>

            <li>
                <Link to="/audit" className="block hover:text-blue-400">
                    Audit Trail
                </Link>
            </li>
        </RenderOnRole>

        {/* Shared */}
        <RenderOnRole roles={["maker", "checker", "apicaller"]}>
            <li>
                <Link to="/query" className="block hover:text-blue-400">
                    Query Shortcode
                </Link>
            </li>
        </RenderOnRole>

    </ul>
</nav>
    </aside>
  );
}

export default Sidebar;