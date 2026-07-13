import React, { useEffect, useState } from 'react';
import URLConstants from '../urlsConfig';
import HttpService from '../services/HttpService';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';

import { PageHeader }      from './ui/PageHeader';
import { ConfirmationModal } from './ui/ConfirmationModal';
import { useToast, Toast } from './ui/Toast';
import DataTable           from './ui/DataTable';
import SearchBar           from './ui/SearchBar';

/**
 * PendingRequests
 *
 * UI MODERNIZATION ONLY — business logic preserved exactly:
 *   - GET  /pending     → list of unapproved ShortCodeDto records
 *   - POST /approve     → { accountNumber, approver } → DTOResponse
 *   - Success check remains `data.approved` (unchanged — see note below)
 *   - Receipt download via getReceiptURL (now a secondary action)
 *
 * NOTE ON `data.approved`:
 *   This field's presence on DTOResponse has not yet been verified against
 *   the backend DTO source. Per project decision, this check is preserved
 *   exactly as it existed prior to modernization until DTOResponse.java
 *   is reviewed. Do not "fix" this without explicit backend confirmation.
 */
function PendingRequests() {
  const [pending, setPending]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm]     = useState('');
  const { toasts, removeToast, toast }  = useToast();
  const authedAxios = HttpService.getAxiosClient();

  const getPending = () => {
    setLoading(true);
    authedAxios
      .get(`${URLConstants.baseAPIURL}/${URLConstants.pendingRequestURL}`, { timeout: 5000 })
      .then((response) => {
        setLoading(false);
        setPending(response.data || []);
      })
      .catch((error) => {
        setLoading(false);
        if (error.code === 'ECONNABORTED') {
          toast.warning('Request timed out. Please try again.', 'Timeout');
        } else {
          toast.error('Failed to load pending approvals.', 'Error');
        }
      });
  };

  useEffect(() => { getPending(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Table column definitions ───────────────────────────────────
  const columns = [
    {
      key: 'accountName',
      label: 'Account Name',
      sortable: true,
      render: (row) => (
        <span className="text-sm font-medium text-gray-900">{row.accountName}</span>
      ),
    },
    {
      key: 'accountNumber',
      label: 'Account No.',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-gray-600">{row.accountNumber}</span>
      ),
    },
    {
      key: 'initiator',
      label: 'Requested By',
      sortable: true,
      render: (row) => (
        <span className="text-sm text-gray-600">{row.initiator}</span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
      className: 'text-right',
      hideOnMobile: true, // mobile gets its own button via renderMobileCard
      render: (row) => (
        <button
          onClick={() => setSelectedItem(row)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
            bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Review & Approve
        </button>
      ),
    },
  ];

  // ── Custom mobile card (keeps the original "Review" compact button) ──
  const renderMobileCard = (row) => (
    <div className="px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{row.accountName}</p>
          <p className="text-xs font-mono text-gray-500 mt-0.5">{row.accountNumber}</p>
          <p className="text-xs text-gray-400 mt-1">By: {row.initiator}</p>
        </div>
        <button
          onClick={() => setSelectedItem(row)}
          className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold bg-blue-50
            text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Review
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />

      <PageHeader
        title="Pending Approvals"
        subtitle="Review and approve shortcode requests submitted by makers"
        action={
          <button
            onClick={getPending}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600
              bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        }
      />

      {/* ── Toolbar: search only (no meaningful filter dimension here) ── */}
      {!loading && pending.length > 0 && (
        <div className="mb-4 max-w-md">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search by account name, number, or requester..."
          />
        </div>
      )}

      {/* ── Data table ─────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={pending}
        searchTerm={searchTerm}
        searchKeys={['accountName', 'accountNumber', 'initiator']}
        loading={loading}
        loadingColumns={columns.length}
        pageSize={10}
        rowKey={(row) => row.id ?? row.accountNumber}
        renderMobileCard={renderMobileCard}
        emptyTitle={searchTerm ? 'No matching requests' : 'No pending approvals'}
        emptyDescription={
          searchTerm
            ? 'Try adjusting your search term.'
            : 'All shortcode requests have been processed. Check back later.'
        }
      />

      {/* ── Approval modal ────────────────────────────────────────── */}
      {selectedItem && (
        <ApprovalModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSuccess={() => {
            setSelectedItem(null);
            getPending();
            toast.success('Shortcode approved successfully.', 'Approved');
          }}
          onError={(msg) => toast.error(msg, 'Approval Failed')}
        />
      )}
    </div>
  );
}

/**
 * ApprovalModal
 * Logic is byte-for-byte identical to the pre-modernization version:
 *   - same payload shape: { accountNumber, approver }
 *   - same success check: `data.approved`
 *   - same navigation to /pending on success
 *   - same error handling branches
 * Only the receipt download button has moved to a visually secondary position.
 */
function ApprovalModal({ item, onClose, onSuccess, onError }) {
  const [loading, setLoading]             = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [shortCodeResponse, setShortCodeResponse] = useState(null);

  const [checking, setChecking] = useState(true);
  const [availability, setAvailability] = useState(null);

  const authedAxios = HttpService.getAxiosClient();
  const navigate = useNavigate();

  useEffect(() => {

  if (!item?.shortCode) {
    setChecking(false);
    return;
  }

  setChecking(true);

  authedAxios
    .get(
      `${URLConstants.baseAPIURL}/${URLConstants.checkShortCodeURL(item.shortCode)}`
    )
    .then((response) => {
      setAvailability(response.data);
      setChecking(false);
    })
    .catch(() => {
      setAvailability({
        available: false,
        message: "Unable to verify shortcode."
      });
      setChecking(false);
    });

}, [item, authedAxios]);

  const approve = () => {
    if (loading) return;
    setLoading(true);

    const payload = {
      accountNumber: item.accountNumber,
      approver: UserService.getUsername(),
    };

    authedAxios
      .post(`${URLConstants.baseAPIURL}/${URLConstants.approveURL}`, payload)
      .then((response) => {
        const data = response.data;
        setLoading(false);
        if (data.approved) {
          setShortCodeResponse(data);
          setDownloadReady(true);
          onSuccess();
          navigate('/pending');
        } else {
          onError('The approval could not be processed. Please try again.');
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.code === 'ECONNABORTED') {
          onError('The request timed out. Please try again.');
        } else {
          onError('Failed to approve this request.');
        }
        onClose();
      });
  };

  const downloadReceipt = () => {
    window.open(
      `${URLConstants.baseURL}/${URLConstants.getReceiptURL(shortCodeResponse?.shortCode)}`,
      '_blank',
      'height=570,width=520'
    );
  };


  const canApprove =
  availability &&
  availability.available;

  return (
    <ConfirmationModal
      isOpen
      onClose={onClose}
      onConfirm={canApprove ? approve : undefined}
      title="Approve Shortcode Request"
      confirmLabel={ canApprove
      ? "Approve Request"
      : "Cannot Approve"}
      confirmVariant="primary"
      loading={loading}
      loadingLabel="Approving..."
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-500 mb-4">
          Please review the details below before approving this shortcode request.
        </p>

        <dl className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
          {[
            { label: 'Account Name', value: item.accountName },
            { label: 'Account Number', value: item.accountNumber },
            { label: 'Requested Shortcode', value: item.shortCode },
            { label: 'Initiated By', value: item.initiator },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center px-4 py-3 bg-white even:bg-gray-50">
              <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-36 flex-shrink-0">{label}</dt>
              <dd className="text-sm font-medium text-gray-900 font-mono">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="rounded-lg border p-4 mt-4">

  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
    Shortcode Availability
  </p>

  {checking ? (

    <div className="flex items-center gap-2 text-gray-500 text-sm">

      <svg
        className="animate-spin w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>

      Checking shortcode...

    </div>

  ) : availability?.available ? (

    <div className="flex items-center gap-2">

      <span className="h-3 w-3 rounded-full bg-green-500"></span>

      <span className="font-medium text-green-700">
        Available
      </span>

    </div>

  ) : (

    <div className="flex items-center gap-2">

      <span className="h-3 w-3 rounded-full bg-red-500"></span>

      <div>

        <p className="font-medium text-red-700">
          Not Available
        </p>

        <p className="text-xs text-red-500">
          {availability?.message}
        </p>

      </div>

    </div>

  )}

</div>

        {/* Receipt download — secondary action.
            Email is sent automatically by the backend on approval;
            this remains as a fallback / convenience only. */}
        {downloadReady && (
          <div className="flex items-start gap-2 pt-1">
            <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-[11px] text-gray-400 mb-1.5">
                A copy has also been emailed automatically. Use this only if you need it now.
              </p>
              <button
                onClick={downloadReceipt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                  text-gray-600 bg-gray-50 border border-gray-200 rounded-lg
                  hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Shortcode Details
              </button>
            </div>
          </div>
        )}
      </div>
    </ConfirmationModal>
  );
}

export default PendingRequests;