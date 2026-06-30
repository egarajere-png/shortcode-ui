import React, { useState, useEffect, useRef } from 'react';

/**
 * SearchBar
 * Reusable debounced search input for filtering tables/lists client-side.
 *
 * Props:
 *   value          string    Controlled value (optional — can be uncontrolled)
 *   onSearch       func      Called with the debounced search term
 *   placeholder    string
 *   debounceMs     number    Debounce delay (default 250)
 *   autoFocus      bool
 */
function SearchBar({
  value,
  onSearch,
  placeholder = 'Search...',
  debounceMs = 250,
  autoFocus = false,
}) {
  const [term, setTerm] = useState(value || '');
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch?.(term);
    }, debounceMs);
    return () => clearTimeout(debounceRef.current);
  }, [term]); // eslint-disable-line react-hooks/exhaustive-deps

  const clear = () => setTerm('');

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={placeholder}
        className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-300
          rounded-lg text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors"
      />
      {term && (
        <button
          onClick={clear}
          className="absolute inset-y-0 right-0 flex items-center pr-3
            text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchBar;