import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RegistryService from '../services/RegistryService';

import { PageHeader }     from './ui/PageHeader';
import { StatusBadge }    from './ui/StatusBadge';
import DataTable          from './ui/DataTable';
import SearchBar          from './ui/SearchBar';
import FilterDropdown     from './ui/FilterDropdown';
import LoadingSkeleton    from './ui/LoadingSkeleton';
import { useToast, Toast } from './ui/Toast';

// Map the :status route param to the internal filter value used by the table
const STATUS_PARAM_MAP = {
  active: "active",
  "pending-approval": "pending-approval",
  "pending-deletion": "pending-deletion",
  deleted: "deleted",
};

function Registry() {
  const { status: statusParam } = useParams();
  const navigate = useNavigate();
  const { toasts, removeToast, toast } = useToast();

  const [registry, setRegistry] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(
    statusParam && STATUS_PARAM_MAP[statusParam] ? STATUS_PARAM_MAP[statusParam] : ''
  );

  // Keep filter in sync if the URL param changes externally (e.g. sidebar link)
  useEffect(() => {
    if (statusParam && STATUS_PARAM_MAP[statusParam]) {
      setStatusFilter(STATUS_PARAM_MAP[statusParam]);
    } else if (!statusParam) {
      setStatusFilter('');
    }
  }, [statusParam]);

  useEffect(() => {
    setLoading(true);
    RegistryService.getRegistry()
      .then((response) => {
       console.log("Registry Response:");
    console.table(response.data);

    setRegistry(response.data || []);
    setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast.error('Failed to load shortcode registry. Please try again.', 'Error');
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived summary counts ─────────────────────────────────────
  const counts = useMemo(() => {
  const active = registry.filter((r) => r.status === "Active").length;

  const pendingApproval = registry.filter(
    (r) => r.status === "Pending Approval"
  ).length;

  const pendingDeletion = registry.filter(
    (r) => r.status === "Pending Deletion"
  ).length;

  const deleted = registry.filter(
    (r) => r.status === "Deleted"
  ).length;

  return {
    total: registry.length,
    active,
    pendingApproval,
    pendingDeletion,
    deleted,
  };
}, [registry]);

  // ── Apply status filter before passing to DataTable (search stays in DataTable) ──
  const statusFiltered = useMemo(() => {

  if (!statusFilter) return registry;

  return registry.filter(
    (r) =>
      r.status
        ?.toLowerCase()
        .replace(/\s+/g, "-") === statusFilter
  );

}, [registry, statusFilter]);

  // Sync filter changes back into the URL so the route stays meaningful
  const handleStatusChange = (value) => {

  setStatusFilter(value);

  if (value) {
    navigate(`/registry/${value}`);
  } else {
    navigate("/registry");
  }

};

// Label shown on the Excel export button
const exportLabel = useMemo(() => {

  if (!statusFilter) return "Full Registry";

  switch (statusFilter) {

    case "active":
      return "Active Registry";

    case "pending-approval":
      return "Pending Approval Registry";

    case "pending-deletion":
      return "Pending Deletion Registry";

    case "deleted":
      return "Deleted Registry";

    default:
      return "Full Registry";
  }

}, [statusFilter]);

  // ── Table column definitions ───────────────────────────────────
  const columns = [
    {
      key: 'shortCode',
      label: 'Shortcode',
      sortable: true,
      render: (row) => (
        <span className="font-mono font-semibold text-gray-900 text-sm">
          {row.shortCode}
        </span>
      ),
    },
    {
      key: 'accountNumber',
      label: 'Account Number',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-gray-600">{row.accountNumber}</span>
      ),
    },
    {
      key: 'accountName',
      label: 'Customer',
      sortable: true,
      render: (row) => (
        <span className="text-sm font-medium text-gray-800">{row.accountName}</span>
      ),
    },
    {
      key: 'phoneNumber',
      label: 'Phone Number',
      sortable: true,
      hideOnMobile: true,
      render: (row) => (
        <span className="text-xs text-gray-500 font-mono">{row.phoneNumber || '—'}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
      <StatusBadge
        status={row.status}
        label={row.status}
      />
        ),
    },
    {
      key: 'audit',
      label: 'Audit',
      sortable: false,
      className: 'text-right',
      render: (row) => (
        <Link
          to={`/audit/${row.shortCode}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
            bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          View Audit
        </Link>
      ),
    },
  ];

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />

      <PageHeader
        title="Shortcode Registry"
        subtitle="Master list of all approved shortcodes and their linked accounts"
        action={
  <div className="flex items-center gap-2">
    <button
  onClick={() => RegistryService.exportRegistryExcel(statusFilter)}
  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
>
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 16v-8m0 8l-3-3m3 3l3-3M5 20h14"
    />
  </svg>

  Download {exportLabel}

</button>

    <button
      onClick={() => window.location.reload()}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Refresh
    </button>

    <span className="text-xs text-gray-400 ml-2">
      {counts.total} total record{counts.total !== 1 ? "s" : ""}
    </span>
  </div>
}
      />

      {/* ── Summary cards ──────────────────────────────────────── */}
      {loading ? (
        <div className="mb-6">
          <LoadingSkeleton variant="cards" rows={3} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">

   <SummaryCard
    label="Total"
    value={counts.total}
    colorClass="text-blue-700"
    bgClass="bg-blue-50"
    icon={
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
      </svg>
    }
  />

  <SummaryCard
    label="Active"
    value={counts.active}
    colorClass="text-green-700"
    bgClass="bg-green-50"
    icon={<span>✓</span>}
  />

  <SummaryCard
    label="Pending Approval"
    value={counts.pendingApproval}
    colorClass="text-yellow-700"
    bgClass="bg-yellow-50"
    icon={<span>⏳</span>}
  />

  <SummaryCard
    label="Pending Deletion"
    value={counts.pendingDeletion}
    colorClass="text-orange-700"
    bgClass="bg-orange-50"
    icon={<span>🗑</span>}
  />

  <SummaryCard
    label="Deleted"
    value={counts.deleted}
    colorClass="text-red-700"
    bgClass="bg-red-50"
    icon={<span>✕</span>}
  />

</div>
      )}

      {/* ── Toolbar: search + filter ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search by shortcode, account number, customer, or phone..."
          />
        </div>
        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={handleStatusChange}
          allLabel="All Statuses"
         options={[
  {
    value: "active",
    label: "Active",
    count: counts.active,
  },
  {
    value: "pending-approval",
    label: "Pending Approval",
    count: counts.pendingApproval,
  },
  {
    value: "pending-deletion",
    label: "Pending Deletion",
    count: counts.pendingDeletion,
  },
  {
    value: "deleted",
    label: "Deleted",
    count: counts.deleted,
  },
]}
        />
      </div>

      {/* ── Data table ─────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={statusFiltered}
        searchTerm={searchTerm}
        searchKeys={['shortCode', 'accountNumber', 'accountName', 'phoneNumber']}
        loading={loading}
        loadingColumns={columns.length}
        pageSize={10}
        rowKey={(row) => row.shortCode}
        emptyTitle={searchTerm ? 'No matching records' : 'No shortcodes in registry'}
        emptyDescription={
          searchTerm
            ? 'Try adjusting your search term or status filter.'
            : 'Approved shortcodes will appear here once requests are processed.'
        }
      />
    </div>
  );
}

// ─── Local summary card (matches Dashboard AnalyticsCard visual language) ────
function SummaryCard({ label, value, colorClass, bgClass, icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg ${bgClass} flex items-center justify-center flex-shrink-0`}>
        <div className={`w-5 h-5 ${colorClass}`}>{icon}</div>
      </div>
      <div>
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        <p className="text-xs font-medium text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default Registry;