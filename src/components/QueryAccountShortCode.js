import React, { useState } from 'react';
import Loading from './loading/Loading';
import HttpService from '../services/HttpService';
import URLConstants from '../urlsConfig';
import { PageHeader } from './ui/PageHeader';
import { InputField } from './ui/InputField';
import { Button } from './ui/Button';
import { StatusBadge } from './ui/StatusBadge';
import { EmptyState } from './ui/EmptyState';
import { useToast, Toast } from './ui/Toast';
import { useNavigate } from 'react-router-dom';

function QueryAccountShortCode() {
  const authedAxios = HttpService.getAxiosClient();
  const { toasts, removeToast, toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [queriedAccount, setQueriedAccount] = useState('');

  const handleLookup = (e) => {
    e.preventDefault();
    const account = e.target.account.value.trim();
    setLoading(true);
    setResults(null);
    setQueriedAccount(account);

    authedAxios
      .get(`${URLConstants.baseAPIURL}/${URLConstants.getAccountShortCodesURL(account)}`, { timeout: 10000 })
      .then((response) => {
        setLoading(false);
        const data = response.data;
        if (Array.isArray(data)) {
          setResults(data);
          if (data.length === 0) {
            toast.info('No shortcodes found for this account.', 'No Results');
          }
        } else {
          setResults([]);
          toast.warning('Unexpected response format.', 'Warning');
        }
      })
      .catch((error) => {
        setLoading(false);
        setResults(null);
        if (error.code === 'ECONNABORTED') {
          toast.warning('The request timed out. Please try again.', 'Timeout');
        } else {
          toast.error('Could not retrieve shortcodes for this account.', 'Error');
        }
      });
  };

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />
      <PageHeader
        title="Query Account Shortcodes"
        subtitle="Retrieve all shortcodes linked to a customer account number"
      />

      <div className="max-w-xl mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <InputField
                id="account"
                name="account"
                placeholder="Enter account number"
                required
              />
            </div>
            <Button type="submit" loading={loading} loadingText="Searching..." className="flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Button>
          </form>
        </div>
      </div>

      {loading && <Loading message="Retrieving account shortcodes..." />}

      {results !== null && (
        <div className="max-w-2xl">
          {/* Result header */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">
              {results.length > 0
                ? <><span className="font-semibold text-gray-900">{results.length}</span> shortcode{results.length !== 1 ? 's' : ''} found for account <span className="font-mono text-gray-700">{queriedAccount}</span></>
                : <>No shortcodes found for <span className="font-mono text-gray-700">{queriedAccount}</span></>
              }
            </p>
          </div>

          {results.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200">
              <EmptyState
                title="No shortcodes on this account"
                description="This account has no active shortcodes. A shortcode request can be submitted via the 'Request Shortcode' page."
              />
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((item, i) => (
                <ShortCodeCard key={i} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ShortCodeCard({ item }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Shortcode badge */}
        <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center">
          <span className="text-xs font-bold text-blue-700 text-center leading-tight font-mono">
            {item.shortCode}
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-900 truncate">{item.accountName}</p>
            <StatusBadge status="active" label="Active" />
          </div>
          <p className="text-xs font-mono text-gray-400 mt-0.5">{item.accountNumber}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Approved by <span className="text-gray-600">{item.approver}</span>
            {item.dateApproved ? ` · ${item.dateApproved}` : ''}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
          <button
            onClick={() => navigate(`/audit/${item.shortCode}`)}
            className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            title="View audit trail"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
          <button
            onClick={() => window.open(`${URLConstants.baseURL}/${URLConstants.getReceiptURL(item?.shortCode)}`, '_blank', 'height=570,width=520')}
            className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            title="Download details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default QueryAccountShortCode;