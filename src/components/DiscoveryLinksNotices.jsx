import { CheckCircle2, RefreshCw } from 'lucide-react';

import { getDiscoveryLinksRefreshButtonProps } from '../utils/discoveryLinksCopy';

export default function DiscoveryLinksNotices({
  error,
  loading,
  notice,
  onRefresh,
  savingMessage,
}) {
  const refreshButtonProps = getDiscoveryLinksRefreshButtonProps();

  return (
    <>
      {error ? (
        <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="leading-relaxed">{error}</p>
            {onRefresh ? (
              <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                className={`inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg px-3 text-xs font-extrabold transition ${
                  loading
                    ? 'cursor-not-allowed bg-red-100 text-red-300'
                    : 'bg-white text-red-700 ring-1 ring-red-200 hover:bg-red-100'
                }`}
                title={refreshButtonProps.title}
                aria-label={refreshButtonProps['aria-label']}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {refreshButtonProps.label}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {savingMessage ? (
        <div role="status" aria-live="polite" className="mt-4 flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm font-semibold text-indigo-700">
          <RefreshCw className="h-4 w-4 shrink-0 animate-spin" />
          {savingMessage}
        </div>
      ) : null}

      {notice && !savingMessage ? (
        <div role="status" aria-live="polite" className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {notice}
        </div>
      ) : null}
    </>
  );
}
