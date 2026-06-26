import React, { useState } from 'react';
import HttpService from '../services/HttpService';
import URLConstants from '../urlsConfig';
import { PageHeader } from './ui/PageHeader';
import { InputField, TextareaField } from './ui/InputField';
import { Button } from './ui/Button';
import { ConfirmationModal } from './ui/ConfirmationModal';
import { useToast, Toast } from './ui/Toast';

function DeleteShortCode() {
  const authedAxios = HttpService.getAxiosClient();
  const { toasts, removeToast, toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState(null);

  // Capture form values into state, then show confirm modal
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormData({
      accountNumber: e.target.accountNumber.value,
      shortCode: parseInt(e.target.shortCode.value),
      deleteRemark: e.target.remark.value,
    });
    setShowConfirm(true);
  };

  const handleConfirmedDelete = () => {
    setLoading(true);

    authedAxios
      .delete(`${URLConstants.baseAPIURL}/${URLConstants.deleteShortCodeURL}`, { data: formData })
      .then((response) => {
        setLoading(false);
        setShowConfirm(false);
        setFormData(null);
        toast.success(response.data.message || 'Delete request submitted successfully.', 'Request Submitted');
        // Reset form
        document.getElementById('delete-form')?.reset();
      })
      .catch((error) => {
        setLoading(false);
        setShowConfirm(false);
        console.log(error);
        toast.error('Failed to submit the delete request. Please try again.', 'Error');
      });
  };

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />
      <PageHeader
        title="Delete Shortcode"
        subtitle="Initiate a shortcode deletion request — requires checker approval"
      />

      {/* Warning banner */}
      <div className="max-w-xl mb-6">
        <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-800">This action requires checker approval</p>
            <p className="text-sm text-red-600 mt-0.5">
              Submitting this form initiates a deletion request. The shortcode will only be deactivated after a checker approves the request.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-xl">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Deletion Request Details</h2>
          </div>
          <form id="delete-form" onSubmit={handleFormSubmit} className="px-6 py-5 space-y-4">
            <InputField
              label="Account Number"
              id="accountNumber"
              name="accountNumber"
              placeholder="Enter customer account number"
              required
            />
            <InputField
              label="Short Code"
              id="shortCode"
              name="shortCode"
              type="number"
              placeholder="Enter shortcode to delete"
              required
            />
            <TextareaField
              label="Reason for Deletion"
              id="remark"
              name="remark"
              placeholder="Provide a clear reason for this deletion request..."
              rows={3}
              required
            />
            <div className="pt-2">
              <Button type="submit" variant="danger" size="lg" fullWidth>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Initiate Delete Request
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation modal */}
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmedDelete}
        title="Confirm Deletion Request"
        confirmLabel="Yes, Submit Request"
        cancelLabel="Cancel"
        confirmVariant="danger"
        loading={loading}
        loadingLabel="Submitting..."
      >
        <div className="space-y-4">
          <div className="flex gap-3 bg-red-50 border border-red-100 rounded-lg p-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-sm text-red-700">
              This will submit a deletion request for checker review. The shortcode will remain active until approved.
            </p>
          </div>
          <dl className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
            {[
              { label: 'Account Number', value: formData?.accountNumber },
              { label: 'Short Code', value: formData?.shortCode },
              { label: 'Reason', value: formData?.deleteRemark },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col sm:flex-row px-4 py-3 gap-1 bg-white even:bg-gray-50">
                <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400 sm:w-36 flex-shrink-0">{label}</dt>
                <dd className="text-sm font-medium text-gray-900 break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </ConfirmationModal>
    </div>
  );
}

export default DeleteShortCode;