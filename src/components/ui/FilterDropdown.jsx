import React, { useState, useRef, useEffect } from 'react';

/**
 * FilterDropdown
 * Reusable single-select filter button + dropdown panel.
 * Used for status filters (e.g. Active/Deleted) and will be reused
 * by Pending Requests / Pending Delete Requests for future filter needs.
 *
 * Props:
 *   label       string   Button label when no filter active (e.g. "Status")
 *   options     array    [{ value, label, count? }]
 *   value       string   Currently selected value (or '' / null for "All")
 *   onChange    func     (value) => void
 *   allLabel    string   Label for the "clear filter" option (default "All")
 */
function FilterDropdown({ label = 'Filter', options = [], value, onChange, allLabel = 'All' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selected = options.find((o) => o.value === value);
  const isActive = !!value;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium
          rounded-lg border transition-colors
          ${isActive
            ? 'bg-blue-50 border-blue-200 text-blue-700'
            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        {selected ? selected.label : label}
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg
          border border-gray-200 z-30 overflow-hidden py-1">
          <button
            onClick={() => { onChange(''); setOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm transition-colors
              ${!value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            {allLabel}
          </button>
          <div className="h-px bg-gray-100 my-1" />
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center
                justify-between transition-colors
                ${value === opt.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <span>{opt.label}</span>
              {opt.count !== undefined && (
                <span className="text-xs text-gray-400">{opt.count}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;