import React, { useState } from 'react';
import Loading from './loading/Loading';
import HttpService from '../services/HttpService';
import UserService from '../services/UserService';
import URLConstants from '../urlsConfig';
import { PageHeader } from './ui/PageHeader';
import { InputField } from './ui/InputField';
import { Button } from './ui/Button';
import { useToast, Toast } from './ui/Toast';

// ─── Step indicator (used by production flow only) ────────────────────────────
function StepBar({ current }) {
  const steps = ['Search Account', 'Review Details', 'Submit Request'];
  return (
    <div className="flex items-center mb-8">
      {steps.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                ${done  ? 'bg-blue-700 border-blue-700 text-white'
                : active ? 'bg-white border-blue-700 text-blue-700'
                         : 'bg-white border-gray-300 text-gray-400'}`}>
                {done
                  ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  : step}
              </div>
              <span className={`mt-1.5 text-xs font-medium whitespace-nowrap hidden sm:block
                ${active ? 'text-blue-700' : done ? 'text-gray-500' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 transition-all ${done ? 'bg-blue-700' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Detail row (review card) ─────────────────────────────────────────────────
function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 last:border-0 gap-1">
      <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400 sm:w-40 flex-shrink-0">{label}</dt>
      <dd className="text-sm font-medium text-gray-900 font-mono">{value || '—'}</dd>
    </div>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────
function TabBar({ active, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-6">
      <button
        onClick={() => onChange('lookup')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all
          ${active === 'lookup'
            ? 'bg-white text-blue-700 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'}`}
      >
        Lookup Existing Account
      </button>
      <button
        onClick={() => onChange('manual')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2
          ${active === 'manual'
            ? 'bg-white text-amber-700 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'}`}
      >
        Manual Test Entry
        <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
          Testing Only
        </span>
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
function RequestShortCode() {
  const authedAxios = HttpService.getAxiosClient();
  const { toasts, removeToast, toast } = useToast();

  const [activeTab, setActiveTab] = useState('lookup');

  // Reset step when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setStep(1);
    setAccountLookupResponse(null);
  };

  // ── Production flow state ──
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [accountLookupResponse, setAccountLookupResponse] = useState(null);

  // ── Manual test state ──
  const [manualLoading, setManualLoading] = useState(false);

  // ── Production: account lookup ──
  const handleCustomerLookUp = (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage('Searching account...');

    authedAxios
      .get(`${URLConstants.baseAPIURL}/${URLConstants.validateEndpointURL(e.target.account.value)}`, { timeout: 10000 })
      .then((response) => {
        setLoading(false);
        const data = response.data;
        if (data?.accountStatus) {
          setAccountLookupResponse(data);
          setStep(2);
        } else {
          toast.error('Account not found. Please check the account number and try again.', 'Not Found');
        }
      })
      .catch((error) => {
        setLoading(false);
        setAccountLookupResponse(null);
        if (error.code === 'ECONNABORTED') {
          toast.warning('The request timed out. Please try again.', 'Timeout');
        } else {
          toast.error('Could not retrieve account details. Please try again.', 'Error');
        }
      });
  };

  // ── Production: submit shortcode request ──
  const handleShortCodeRequest = () => {
    setLoadingMessage('Submitting shortcode request...');
    setLoading(true);

    const payload = {
      accountName:   accountLookupResponse?.accountName,
      accountNumber: accountLookupResponse?.accountNumber,
      approved:      true,
      approver:      UserService.getUsername(),
      custId:        accountLookupResponse?.custId,
      dateApproved:  new Date(),
      dateInitiated: new Date(),
      emailAddress:  accountLookupResponse?.emailAddress,
      id:            0,
      idNumber:      accountLookupResponse?.idNumber,
      initiator:     UserService.getUsername(),
      phoneNumber:   accountLookupResponse?.phoneNumber,
      sequenceNumber: 0,
      shortCode:     0,
    };

    authedAxios
      .post(`${URLConstants.baseAPIURL}/${URLConstants.initateValidationURL}`, payload)
      .then((response) => {
        setLoading(false);
        const data = response.data;
        if (data?.statusCode === '000') {
          toast.success(data?.message || 'Shortcode request submitted successfully.', 'Request Submitted');
          setStep(3);
        } else {
          toast.error('Failed to submit request: ' + (data?.message || 'Unknown error'), 'Submission Failed');
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.code === 'ECONNABORTED') {
          toast.warning('The request timed out. Please try again.', 'Timeout');
        } else {
          toast.error('Failed to submit shortcode request.', 'Error');
        }
      });
  };

  const resetProduction = () => {
    setStep(1);
    setAccountLookupResponse(null);
  };

  // ── Manual test: submit directly to /initiate ──
  const handleManualSubmit = (e) => {
    e.preventDefault();
    setManualLoading(true);

    const f = e.target;
    const payload = {
      accountName:    f.accountName.value,
      accountNumber:  f.accountNumber.value,
      approved:       true,
      approver:       UserService.getUsername(),
      custId:         f.custId.value,
      dateApproved:   new Date(),
      dateInitiated:  new Date(),
      emailAddress:   f.emailAddress.value,
      id:             0,
      idNumber:       f.idNumber.value,
      initiator:      UserService.getUsername(),
      phoneNumber:    f.phoneNumber.value,
      sequenceNumber: 0,
      shortCode:      0,
    };

    authedAxios
      .post(`${URLConstants.baseAPIURL}/${URLConstants.initateValidationURL}`, payload)
      .then((response) => {
        setManualLoading(false);
        const data = response.data;
        if (data?.statusCode === '000') {
          toast.success(data?.message || 'Test request submitted successfully.', 'Test Submitted');
          f.reset();
        } else {
          toast.error('Failed: ' + (data?.message || 'Unknown error'), 'Submission Failed');
        }
      })
      .catch((error) => {
        setManualLoading(false);
        if (error.code === 'ECONNABORTED') {
          toast.warning('The request timed out. Please try again.', 'Timeout');
        } else {
          toast.error('Failed to submit test request.', 'Error');
        }
      });
  };

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />
      <PageHeader
        title="Request Shortcode"
        subtitle="Submit a new shortcode request for a customer account"
      />

      <TabBar active={activeTab} onChange={handleTabChange} />

      {/* ── PRODUCTION TAB ─────────────────────────────────────────── */}
      {activeTab === 'lookup' && (
        <div className="max-w-2xl">
          <StepBar current={step} />

          {/* Step 1: Search */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-1">Search Customer Account</h2>
              <p className="text-sm text-gray-500 mb-5">
                Enter the customer's bank account number to retrieve their details.
              </p>
              <form onSubmit={handleCustomerLookUp} className="space-y-4">
                <InputField
                  label="Customer Account Number"
                  id="account"
                  name="account"
                  placeholder="e.g. 0012345678"
                  required
                />
                <Button type="submit" loading={loading} loadingText="Searching..." size="lg">
                  Search Account
                </Button>
              </form>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && accountLookupResponse && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-base font-semibold text-gray-900">Review Account Details</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Confirm the details below before submitting the shortcode request.
                </p>
              </div>
              <dl className="px-6 py-2">
                <DetailRow label="Account Name"   value={accountLookupResponse?.accountName} />
                <DetailRow label="Account Number" value={accountLookupResponse?.accountNumber} />
                <DetailRow label="Account Status" value={accountLookupResponse?.accountStatus} />
                <DetailRow label="Customer ID"    value={accountLookupResponse?.custId} />
                <DetailRow label="Phone Number"   value={accountLookupResponse?.phoneNumber} />
                <DetailRow label="Email Address"  value={accountLookupResponse?.emailAddress} />
              </dl>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <Button variant="secondary" onClick={resetProduction}>
                  ← Search Again
                </Button>
                <Button
                  loading={loading}
                  loadingText="Submitting..."
                  onClick={() => { setStep(3); handleShortCodeRequest(); }}
                >
                  Submit Shortcode Request
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Request Submitted</h2>
              <p className="text-sm text-gray-500 mb-6">
                The shortcode request for{' '}
                <span className="font-semibold text-gray-700">{accountLookupResponse?.accountName}</span>{' '}
                has been submitted and is pending checker approval.
              </p>
              <Button onClick={resetProduction} variant="secondary">
                Submit Another Request
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── MANUAL TEST TAB ────────────────────────────────────────── */}
      {activeTab === 'manual' && (
        <div className="max-w-2xl">
          {/* Warning banner */}
          <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-800">Testing Mode — for development use only</p>
              <p className="text-sm text-amber-700 mt-0.5">
                This form submits directly to <span className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">POST /initiate</span> without
                account validation. Do not use in production.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-amber-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-amber-100 bg-amber-50 flex items-center gap-2">
              <h2 className="text-sm font-semibold text-amber-900">Manual Customer Details</h2>
              <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                Testing Only
              </span>
            </div>

            <form onSubmit={handleManualSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Account Name"
                  id="accountName"
                  name="accountName"
                  placeholder="e.g. John Doe Ltd"
                  required
                />
                <InputField
                  label="Account Number"
                  id="accountNumber"
                  name="accountNumber"
                  placeholder="e.g. 0012345678"
                  required
                />
                <InputField
                  label="Customer ID"
                  id="custId"
                  name="custId"
                  placeholder="e.g. CUS001"
                />
                <InputField
                  label="ID Number"
                  id="idNumber"
                  name="idNumber"
                  placeholder="e.g. 12345678"
                />
                <InputField
                  label="Phone Number"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="e.g. 0712345678"
                />
                <InputField
                  label="Email Address"
                  id="emailAddress"
                  name="emailAddress"
                  type="email"
                  placeholder="e.g. test@example.com"
                />
              </div>

              {/* Read-only fields to show what will be auto-populated */}
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Auto-populated fields (sent as-is)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { label: 'approved',       value: 'true' },
                    { label: 'approver',       value: UserService.getUsername() || '(current user)' },
                    { label: 'initiator',      value: UserService.getUsername() || '(current user)' },
                    { label: 'id',             value: '0' },
                    { label: 'shortCode',      value: '0' },
                    { label: 'sequenceNumber', value: '0' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <span className="text-gray-400 font-mono">{label}</span>
                      <span className="text-gray-700 font-mono font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  loading={manualLoading}
                  loadingText="Submitting test..."
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Submit Test Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {(loading || manualLoading) && <Loading message={loadingMessage || 'Submitting...'} />}
    </div>
  );
}

export default RequestShortCode;