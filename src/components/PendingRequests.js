import React, { useEffect, useState } from 'react';
import URLConstants from '../urlsConfig';
import Loading from './loading/Loading';
import HttpService from '../services/HttpService';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from './ui/PageHeader';
import { EmptyState } from './ui/EmptyState';
import { ConfirmationModal } from './ui/ConfirmationModal';
import { useToast, Toast } from './ui/Toast';

function PendingRequests() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { toasts, removeToast, toast } = useToast();
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

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />
      <PageHeader
        title="Pending Approvals"
        subtitle="Review and approve shortcode requests submitted by makers"
        action={
          <button
            onClick={getPending}
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

      {loading && <Loading message="Loading pending approvals..." />}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {pending.length === 0 && !loading ? (
          <EmptyState
            title="No pending approvals"
            description="All shortcode requests have been processed. Check back later."
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
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Requested By</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pending.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-900">{item.accountName}</td>
                      <td className="px-5 py-4 text-gray-600 font-mono text-xs">{item.accountNumber}</td>
                      <td className="px-5 py-4 text-gray-600">{item.initiator}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Review & Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-gray-100">
              {pending.map((item, i) => (
                <div key={i} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{item.accountName}</p>
                      <p className="text-xs font-mono text-gray-500 mt-0.5">{item.accountNumber}</p>
                      <p className="text-xs text-gray-400 mt-1">By: {item.initiator}</p>
                    </div>
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Approval modal */}
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

function ApprovalModal({ item, onClose, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [shortCodeResponse, setShortCodeResponse] = useState(null);
  const authedAxios = HttpService.getAxiosClient();
  const navigate = useNavigate();

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

  return (
    <ConfirmationModal
      isOpen
      onClose={onClose}
      onConfirm={approve}
      title="Approve Shortcode Request"
      confirmLabel="Approve Request"
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
            { label: 'Initiated By', value: item.initiator },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center px-4 py-3 bg-white even:bg-gray-50">
              <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-36 flex-shrink-0">{label}</dt>
              <dd className="text-sm font-medium text-gray-900 font-mono">{value}</dd>
            </div>
          ))}
        </dl>
        {downloadReady && (
          <button
            onClick={downloadReceipt}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Shortcode Details
          </button>
        )}
      </div>
    </ConfirmationModal>
  );
}

export default PendingRequests;