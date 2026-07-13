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
// function TabBar({ active, onChange }) {
//   return (
//     <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-6">
//       <button
//         onClick={() => onChange('lookup')}
//         className={`px-4 py-2 text-sm font-medium rounded-md transition-all
//           ${active === 'lookup'
//             ? 'bg-white text-blue-700 shadow-sm'
//             : 'text-gray-500 hover:text-gray-700'}`}
//       >
//         Lookup Existing Account
//       </button>
      {/* <button
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
      </button> */}
//     </div>
//   );
// }

// ─── Main component ───────────────────────────────────────────────────────────
function RequestShortCode() {
  const authedAxios = HttpService.getAxiosClient();
  const { toasts, removeToast, toast } = useToast();

  // Reset step when switching tabs
  // const handleTabChange = (tab) => {
  //   setActiveTab(tab);
  //   setStep(1);
  //   setAccountLookupResponse(null);
  // };

  // ── Production flow state ──
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [accountLookupResponse, setAccountLookupResponse] = useState(null);
  const [preferredShortCode, setPreferredShortCode] = useState("");
  const [checkingShortCode, setCheckingShortCode] = useState(false);
  const [shortCodeAvailable, setShortCodeAvailable] = useState(null);

  const [shortCodeMode, setShortCodeMode] = useState("AUTO");

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

  const checkShortCodeAvailability = (value) => {

    setPreferredShortCode(value);

    // reset
    setShortCodeAvailable(null);

    if (value.length !== 6) return;

    setCheckingShortCode(true);

    authedAxios
        .get(`${URLConstants.baseAPIURL}/check-shortcode/${value}`)
        .then((response) => {
          setCheckingShortCode(false);
    const data = response.data;
    if (data.statusCode === "000") {
        setShortCodeAvailable(true);
    } else {
        setShortCodeAvailable(false);
    }
})
        .catch((error) => {
          console.error(error);
          setCheckingShortCode(false);
          setShortCodeAvailable(false);

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
      shortCode:    shortCodeMode === "AUTO"
                        ? 0
                        : parseInt(preferredShortCode),
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
    setShortCodeMode("AUTO");
    setPreferredShortCode("");
    setShortCodeAvailable(null);
};


  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />
      <PageHeader
        title="Request Shortcode"
        subtitle="Submit a new shortcode request for a customer account"
      />

      {/* <TabBar active={activeTab} onChange={handleTabChange} /> */}

      {/* ── PRODUCTION TAB ─────────────────────────────────────────── */}
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

    <div className="px-6 py-4 border-t border-gray-100">

    <label className="block text-sm font-semibold text-gray-700 mb-3">
        Shortcode Type
    </label>

    <div className="flex gap-8 mb-5">

        <label className="flex items-center gap-2 cursor-pointer">

            <input
                type="radio"
                checked={shortCodeMode === "AUTO"}
                onChange={() => {

                    setShortCodeMode("AUTO");
                    setPreferredShortCode("");
                    setShortCodeAvailable(null);

                }}
            />

            <span>System Generated Shortcode</span>

        </label>

        <label className="flex items-center gap-2 cursor-pointer">

            <input
                type="radio"
                checked={shortCodeMode === "CUSTOM"}
                onChange={() => {

                    setShortCodeMode("CUSTOM");

                }}
            />

            <span>Choose Custom Shortcode</span>

        </label>

    </div>

    {shortCodeMode === "CUSTOM" && (

        <>

            <InputField
                label="Preferred Shortcode"
                id="preferredShortCode"
                value={preferredShortCode}
                onChange={(e) => {

                    const value = e.target.value.replace(/\D/g, "");

                    if (value.length <= 6) {
                        checkShortCodeAvailability(value);
                    }

                }}
                placeholder="Enter 6 digit shortcode"
            />

            <div className="mt-2">

                {checkingShortCode && (

                    <p className="text-blue-600 text-sm">
                        Checking availability...
                    </p>

                )}

                {!checkingShortCode &&
                    preferredShortCode.length === 6 &&
                    shortCodeAvailable === true && (

                        <p className="text-green-600 text-sm">
                            ✓ Shortcode Available
                        </p>

                )}

                {!checkingShortCode &&
                    preferredShortCode.length === 6 &&
                    shortCodeAvailable === false && (

                        <p className="text-red-600 text-sm">
                            ✗ Shortcode is reserved or Already Taken
                        </p>

                )}

            </div>

        </>

    )}

</div>
              </dl>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <Button variant="secondary" onClick={resetProduction}>
                  ← Search Again
                </Button>
                <Button
                  disabled={
                  loading ||
                  (
                  shortCodeMode === "CUSTOM" && (
                  checkingShortCode ||
                  preferredShortCode.length !== 6 ||
                  shortCodeAvailable !== true
                  )
                  )
                  }
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
                        The
                      <span className="font-semibold">
                                {shortCodeMode === "AUTO"
                                  ? " Sequential "
                         : " Custom "}
                      </span>
                    shortcode request for
                  <span className="font-semibold text-gray-700">
                    {" "}
                    {accountLookupResponse?.accountName}
                  </span>
                {" "}has been submitted and is pending checker approval.
              </p>
              <Button onClick={resetProduction} variant="secondary">
                Submit Another Request
              </Button>
            </div>
          )}
        </div>


{loading && (
    <Loading message={loadingMessage || 'Submitting...'} />
)}
    </div>
  );
}

export default RequestShortCode;