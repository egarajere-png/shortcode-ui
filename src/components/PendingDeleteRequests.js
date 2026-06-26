import React, { useEffect, useState } from 'react';
import HttpService from '../services/HttpService';
import URLConstants from '../urlsConfig';
import { PageHeader } from './ui/PageHeader';
import { EmptyState } from './ui/EmptyState';
import { ConfirmationModal } from './ui/ConfirmationModal';
import { useToast, Toast } from './ui/Toast';

function PendingDeleteRequests() {
  const authedAxios = HttpService.getAxiosClient();
  const { toasts, removeToast, toast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [approving, setApproving] = useState(false);

  const loadRequests = () => {
    setLoading(true);
    authedAxios
      .get(`${URLConstants.baseAPIURL}/${URLConstants.pendingDeleteURL}`)
      .then((response) => {
        setLoading(false);
        setRequests(response.data || []);
      })
      .catch(() => {
        setLoading(false);
        toast.error('Failed to load pending deletion requests.', 'Error');
      });
  };

  useEffect(() => { loadRequests(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const approveDelete = () => {
    if (!selectedItem) return;
    setApproving(true);

    const payload = {
      accountNumber: selectedItem.accountNumber,
      shortCode: selectedItem.shortCode,
    };

    authedAxios
      .post(`${URLConstants.baseAPIURL}/${URLConstants.approveDeleteURL}`, payload)
      .then((response) => {
        setApproving(false);
        setSelectedItem(null);
        toast.success(response.data.message || 'Deletion approved successfully.', 'Deletion Approved');
        loadRequests();
      })
      .catch(() => {
        setApproving(false);
        setSelectedItem(null);
        toast.error('Failed to approve this deletion request.', 'Error');
      });
  };

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />
      <PageHeader
        title="Pending Deletion Requests"
        subtitle="Review and approve shortcode deletion requests submitted by makers"
        action={
          <button
            onClick={loadRequests}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        }
      />

      {/* Warning notice */}
      <div className="max-w-3xl mb-5">
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-sm text-amber-800">
            Approving a deletion request is <span className="font-semibold">irreversible</span>. Please verify account and shortcode details carefully before approving.
          </p>
        </div>
      </div>

      <div className="max-w-3xl bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center gap-3 text-gray-400 px-6 py-10">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-sm">Loading requests...</span>
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            title="No pending deletion requests"
            description="There are no shortcode deletions awaiting approval at this time."
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Account Name</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Account No.</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Shortcode</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map((item, i) => (
                    <tr key={i} className="hover:bg-red-50/30 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-900">{item.accountName}</td>
                      <td className="px-5 py-4 text-gray-600 font-mono text-xs">{item.accountNumber}</td>
                      <td className="px-5 py-4 font-mono text-sm text-gray-700">{item.shortCode}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve Deletion
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-100">
              {requests.map((item, i) => (
                <div key={i} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{item.accountName}</p>
                      <p className="text-xs font-mono text-gray-500 mt-0.5">{item.accountNumber}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Shortcode: <span className="font-mono font-medium text-gray-700">{item.shortCode}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Approval confirmation modal */}
      <ConfirmationModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onConfirm={approveDelete}
        title="Approve Shortcode Deletion"
        confirmLabel="Approve Deletion"
        cancelLabel="Cancel"
        confirmVariant="danger"
        loading={approving}
        loadingLabel="Approving..."
      >
        <div className="space-y-4">
          <div className="flex gap-3 bg-red-50 border border-red-100 rounded-lg p-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-sm text-red-700 font-medium">
              This will permanently deactivate the shortcode. This action cannot be undone.
            </p>
          </div>
          <dl className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
            {[
              { label: 'Account Name', value: selectedItem?.accountName },
              { label: 'Account No.', value: selectedItem?.accountNumber },
              { label: 'Shortcode', value: selectedItem?.shortCode },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center px-4 py-3 bg-white even:bg-gray-50">
                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-32 flex-shrink-0">{label}</dt>
                <dd className="text-sm font-medium text-gray-900 font-mono">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </ConfirmationModal>
    </div>
  );
}

export default PendingDeleteRequests;