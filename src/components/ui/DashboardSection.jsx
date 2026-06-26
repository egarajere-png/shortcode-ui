import React from 'react';

/**
 * DashboardSection
 * Wraps a dashboard content block with a consistent section heading,
 * optional right-side action, and uniform bottom spacing.
 *
 * Props:
 *   title       string   Section label (uppercase small caps style)
 *   action      node     Optional right-aligned element (button, link, etc.)
 *   children    node     Section content
 *   className   string   Extra classes on the wrapper
 */
function DashboardSection({ title, action, children, className = '' }) {
  return (
    <section className={`mb-8 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
              {title}
            </h2>
          )}
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export default DashboardSection;
