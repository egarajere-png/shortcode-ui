import React, { useState } from 'react';
import Loading from './loading/Loading';
import HttpService from '../services/HttpService';
import { useNavigate } from 'react-router-dom';
import URLConstants from '../urlsConfig';
import { PageHeader } from './ui/PageHeader';
import { InputField } from './ui/InputField';
import { Button } from './ui/Button';
import { StatusBadge } from './ui/StatusBadge';
import { useToast, Toast } from './ui/Toast';

function QueryShortCode() {
  const authedAxios = HttpService.getAxiosClient();
  const { toasts, removeToast, toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleLookup = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    authedAxios
      .get(`${URLConstants.baseAPIURL}/${URLConstants.getShortCodeAccountDetailsURL(e.target.account.value)}`, { timeout: 10000 })
      .then((response) => {
        setLoading(false);
        const data = response.data;
        if (data?.id) {
          setResult(data);
        } else {
          toast.warning('No shortcode found for that number.', 'Not Found');
        }
      })
      .catch((error) => {
        setLoading(false);
        setResult(null);
        if (error.code === 'ECONNABORTED') {
          toast.warning('The request timed out. Please try again.', 'Timeout');
        } else {
          toast.error('Could not retrieve shortcode details.', 'Error');
        }
      });
  };

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />
      <PageHeader
        title="Query Shortcode"
        subtitle="Look up shortcode details by shortcode number"
      />

      <div className="max-w-xl mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <InputField
                id="account"
                name="account"
                placeholder="Enter shortcode number"
                required
              />
            </div>
            <Button type="submit" loading={loading} loadingText="Searching..." size="md" className="flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Button>
          </form>
        </div>
      </div>

      {loading && <Loading message="Searching shortcode..." />}

      {result && <ShortCodeResultCard account={result} />}
    </div>
  );
}

function ShortCodeResultCard({ account }) {
  const navigate = useNavigate();

  const fields = [
    { label: 'Short Code', value: account?.shortCode, mono: true, highlight: true },
    { label: 'Sequence Number', value: account?.sequenceNumber, mono: true },
    { label: 'Account Name', value: account?.accountName },
    { label: 'Account Number', value: account?.accountNumber, mono: true },
    { label: 'Approved By', value: account?.approver },
    { label: 'Approved On', value: account?.dateApproved },
  ];

  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Card header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Shortcode Details</h3>
            <p className="text-xs text-gray-400 mt-0.5">Retrieved from core banking system</p>
          </div>
          <StatusBadge status="active" label="Active" />
        </div>

        {/* Highlight: shortcode number */}
        <div className="px-6 py-5 border-b border-gray-100 bg-blue-50">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">Shortcode</p>
          <p className="text-3xl font-bold text-blue-900 font-mono">{account?.shortCode}</p>
        </div>

        {/* Fields */}
        <dl className="divide-y divide-gray-100">
          {fields.slice(1).map(({ label, value, mono }) => (
            <div key={label} className="flex flex-col sm:flex-row sm:items-center px-6 py-3 gap-1">
              <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400 sm:w-40 flex-shrink-0">{label}</dt>
              <dd className={`text-sm font-medium text-gray-900 ${mono ? 'font-mono' : ''}`}>{value || '—'}</dd>
            </div>
          ))}
        </dl>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate(`/audit/${account.shortCode}`)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View Audit Trail
          </Button>
          <Button
            variant="secondary"
            onClick={() => window.open(`${URLConstants.baseURL}/${URLConstants.getReceiptURL(account?.shortCode)}`, '_blank', 'height=570,width=520')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Details
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QueryShortCode;