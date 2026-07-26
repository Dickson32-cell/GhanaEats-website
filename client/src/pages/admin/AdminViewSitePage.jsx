import { useState, useRef } from 'react';

/**
 * AdminViewSitePage
 * Embeds the live customer-facing website inside the admin panel
 * so the admin can see and interact with the main site without
 * leaving the admin console.
 */
const AdminViewSitePage = () => {
  const [key, setKey] = useState(0);
  const iframeRef = useRef(null);

  const handleRefresh = () => setKey((k) => k + 1);
  const handleOpenNewTab = () => window.open('/', '_blank');

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark dark:text-white">View Site</h1>
          <p className="text-sm text-dark/50 dark:text-white/50">
            The live customer website — interact with it directly below.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-dark-700 text-dark dark:text-white border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-dark-600 transition-all"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={handleOpenNewTab}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 transition-all"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open in New Tab
          </button>
        </div>
      </div>

      {/* Embedded site */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-700 shadow-sm">
        <iframe
          key={key}
          ref={iframeRef}
          src="/"
          title="GhanaEats Live Site"
          className="w-full h-full border-0"
          style={{ minHeight: 'calc(100vh - 220px)' }}
        />
      </div>
    </div>
  );
};

export default AdminViewSitePage;