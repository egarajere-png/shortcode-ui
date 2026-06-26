import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HttpService from '../services/HttpService';
import URLConstants from '../urlsConfig';
import { PageHeader } from './ui/PageHeader';
import { EmptyState } from './ui/EmptyState';
import { useToast, Toast } from './ui/Toast';

// Map action strings to visual config
function getActionStyle(action = '') {
  const a = action.toLowerCase();
  if (a.includes('initiat') || a.includes('request') || a.includes('submit')) {
    return { dot: 'bg-blue-500', ring: 'ring-blue-200', label: 'bg-blue-50 text-blue-700', icon: '⊕' };
  }
  if (a.includes('approv')) {
    return { dot: 'bg-green-500', ring: 'ring-green-200', label: 'bg-green-50 text-green-700', icon: '✓' };
  }
  if (a.includes('delete') && a.includes('approv')) {
    return { dot: 'bg-red-500', ring: 'ring-red-200', label: 'bg-red-50 text-red-700', icon: '✕' };
  }
  if (a.includes('delete') || a.includes('remov')) {
    return { dot: 'bg-orange-500', ring: 'ring-orange-200', label: 'bg-orange-50 text-orange-700', icon: '⊖' };
  }
  return { dot: 'bg-gray-400', ring: 'ring-gray-200', label: 'bg-gray-50 text-gray-600', icon: '·' };
}

function TimelineItem({ item, isLast }) {
  const style = getActionStyle(item.action);

  return (
    <div className="flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ring-4 ${style.dot} ${style.ring} text-white text-sm font-bold shadow-sm`}>
          {style.icon}
        </div>
        {!isLast && <div className="w-px flex-1 bg-gray-200 mt-2 mb-0" />}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-8 ${isLast ? 'pb-0' : ''}`}>
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${style.label} self-start`}>
              {item.action}
            </span>
            {item.actionDate && (
              <time className="text-xs text-gray-400 flex-shrink-0 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {item.actionDate}
              </time>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Performed By</p>
              <p className="text-sm font-medium text-gray-900">{item.performedBy || '—'}</p>
            </div>
            {item.remarks && (
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Remarks</p>
                <p className="text-sm text-gray-600 italic">"{item.remarks}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditTrail() {
  const { shortCode } = useParams();
  const [auditRecords, setAuditRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, removeToast, toast } = useToast();
  const authedAxios = HttpService.getAxiosClient();

  useEffect(() => {
    setLoading(true);
    authedAxios
      .get(`${URLConstants.baseAPIURL}/audit/${shortCode}`)
      .then((response) => {
        setLoading(false);
        setAuditRecords(response.data || []);
      })
      .catch(() => {
        setLoading(false);
        toast.error('Failed to load audit trail.', 'Error');
      });
  }, [shortCode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />
      <PageHeader
        title="Audit Trail"
        subtitle={`Event history for shortcode ${shortCode}`}
      />

      {loading ? (
        <div className="flex items-center gap-3 text-gray-400 py-8">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm">Loading audit records...</span>
        </div>
      ) : auditRecords.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <EmptyState
            title="No audit records found"
            description={`No events have been recorded for shortcode ${shortCode}.`}
          />
        </div>
      ) : (
        <div className="max-w-2xl">
          {/* Summary pill */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-gray-600">
                {auditRecords.length} event{auditRecords.length !== 1 ? 's' : ''} recorded
              </span>
            </div>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Timeline */}
          <div>
            {auditRecords.map((item, index) => (
              <TimelineItem
                key={index}
                item={item}
                isLast={index === auditRecords.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditTrail;