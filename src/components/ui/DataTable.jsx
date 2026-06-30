import React, { useState, useMemo } from 'react';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';

/**
 * DataTable
 * Fully reusable, generic table component used across Registry, Pending Requests,
 * Pending Delete Requests, and future list pages.
 *
 * Supports (all client-side, since current backend endpoints return full datasets):
 *   - search (via externally-controlled searchTerm + searchKeys)
 *   - column sorting (click header)
 *   - pagination
 *   - loading skeleton
 *   - empty state
 *   - responsive: desktop table / mobile card stack
 *   - custom cell rendering via column.render
 *   - row actions
 *
 * Props:
 *   columns        array   [{ key, label, sortable, render, className, hideOnMobile }]
 *   data           array   Full dataset (already filtered upstream if desired)
 *   searchTerm     string  Optional. If provided, rows are filtered against searchKeys.
 *   searchKeys     array   Object keys to search against (string match, case-insensitive)
 *   loading        bool
 *   loadingColumns number  Columns to show in skeleton (defaults to columns.length)
 *   pageSize       number  Rows per page (default 10)
 *   rowKey         func    (row) => unique key. Defaults to row.id ?? index.
 *   emptyTitle     string
 *   emptyDescription string
 *   renderMobileCard func  Optional custom mobile card renderer (row) => node.
 *                          If omitted, a default card is built from columns.
 *   onRowClick     func    Optional (row) => void
 */
function DataTable({
  columns,
  data,
  searchTerm = '',
  searchKeys = [],
  loading = false,
  loadingColumns,
  pageSize = 10,
  rowKey,
  emptyTitle = 'No records found',
  emptyDescription = 'There is nothing to display yet.',
  renderMobileCard,
  onRowClick,
}) {
  const [sortKey, setSortKey]   = useState(null);
  const [sortDir, setSortDir]   = useState('asc'); // 'asc' | 'desc'
  const [page, setPage]         = useState(1);

  // ── Filter by search term ──────────────────────────────────────
  const filtered = useMemo(() => {
    if (!searchTerm || searchKeys.length === 0) return data;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return data;
    return data.filter((row) =>
      searchKeys.some((key) => {
        const val = row[key];
        return val !== undefined && val !== null &&
          String(val).toLowerCase().includes(term);
      })
    );
  }, [data, searchTerm, searchKeys]);

  // ── Sort ─────────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === undefined || av === null) return 1;
      if (bv === undefined || bv === null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  // ── Paginate ─────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage    = Math.min(page, totalPages);
  const pageData    = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, safePage, pageSize]);

  // Reset to page 1 whenever the filtered/sorted set changes size meaningfully
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, sortKey, sortDir, data.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSort = (col) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  const getRowKey = (row, idx) => rowKey ? rowKey(row) : (row.id ?? idx);

  // ── Loading state ────────────────────────────────────────────────
  if (loading) {
    return <LoadingSkeleton variant="table" rows={pageSize > 6 ? 6 : pageSize} columns={loadingColumns || columns.length} />;
  }

  // ── Empty state ──────────────────────────────────────────────────
  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

      {/* ── Desktop table ─────────────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  className={`px-5 py-3 text-xs font-bold uppercase tracking-wider
                    text-gray-500 select-none
                    ${col.sortable ? 'cursor-pointer hover:text-gray-700' : ''}
                    ${col.className || ''}`}
                  aria-sort={
                    sortKey === col.key
                      ? (sortDir === 'asc' ? 'ascending' : 'descending')
                      : 'none'
                  }
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <span className="flex flex-col -space-y-1 flex-shrink-0">
                        <svg
                          className={`w-2.5 h-2.5 ${sortKey === col.key && sortDir === 'asc' ? 'text-blue-600' : 'text-gray-300'}`}
                          fill="currentColor" viewBox="0 0 20 20"
                        >
                          <path d="M10 4l5 6H5l5-6z" />
                        </svg>
                        <svg
                          className={`w-2.5 h-2.5 ${sortKey === col.key && sortDir === 'desc' ? 'text-blue-600' : 'text-gray-300'}`}
                          fill="currentColor" viewBox="0 0 20 20"
                        >
                          <path d="M10 16l-5-6h10l-5 6z" />
                        </svg>
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageData.map((row, idx) => (
              <tr
                key={getRowKey(row, idx)}
                onClick={() => onRowClick?.(row)}
                className={`hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-4 ${col.className || ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ──────────────────────────────────────── */}
      <div className="md:hidden divide-y divide-gray-100">
        {pageData.map((row, idx) =>
          renderMobileCard ? (
            <div key={getRowKey(row, idx)} onClick={() => onRowClick?.(row)}>
              {renderMobileCard(row)}
            </div>
          ) : (
            <DefaultMobileCard
              key={getRowKey(row, idx)}
              row={row}
              columns={columns}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            />
          )
        )}
      </div>

      {/* ── Pagination footer ─────────────────────────────────── */}
      <TablePagination
        page={safePage}
        totalPages={totalPages}
        totalItems={sorted.length}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </div>
  );
}

// ─── Default mobile card (used when renderMobileCard not provided) ───────────
function DefaultMobileCard({ row, columns, onClick }) {
  // First column = primary/title, rest shown as label:value pairs (skip hideOnMobile)
  const [primary, ...rest] = columns;
  const visible = rest.filter((c) => !c.hideOnMobile);

  return (
    <div
      onClick={onClick}
      className={`px-4 py-4 ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
    >
      <div className="font-semibold text-gray-900 text-sm mb-2">
        {primary.render ? primary.render(row) : row[primary.key]}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {visible.map((col) => (
          <div key={col.key} className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              {col.label}
            </p>
            <div className="text-xs text-gray-700 truncate">
              {col.render ? col.render(row) : row[col.key]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pagination control ────────────────────────────────────────────────────
function TablePagination({ page, totalPages, totalItems, pageSize, onPageChange }) {
  // Build a compact page list with ellipses for large totalPages.
  // NOTE: this hook must run on every render — it sits above the
  // early-return guard below to satisfy the Rules of Hooks.
  const pages = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const set = new Set([1, totalPages, page, page - 1, page + 1]);
    return Array.from(set).filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  }, [page, totalPages]);

  if (totalItems === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3
      px-5 py-3 bg-gray-50 border-t border-gray-100">
      <p className="text-xs text-gray-500">
        Showing <span className="font-semibold text-gray-700">{start}</span>–
        <span className="font-semibold text-gray-700">{end}</span> of{' '}
        <span className="font-semibold text-gray-700">{totalItems}</span>
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-gray-700
              disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {pages.map((p, i) => {
            const prev = pages[i - 1];
            const showEllipsis = prev !== undefined && p - prev > 1;
            return (
              <React.Fragment key={p}>
                {showEllipsis && <span className="px-1 text-gray-300 text-xs">···</span>}
                <button
                  onClick={() => onPageChange(p)}
                  className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-medium transition-colors
                    ${p === page
                      ? 'bg-blue-700 text-white'
                      : 'text-gray-600 hover:bg-white'}`}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </button>
              </React.Fragment>
            );
          })}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-gray-700
              disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default DataTable;