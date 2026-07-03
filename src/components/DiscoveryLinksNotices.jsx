import React from 'react';
import { CheckCircle2, RefreshCw } from 'lucide-react';

export default function DiscoveryLinksNotices({
  error,
  notice,
  savingMessage,
}) {
  return (
    <>
      {error ? (
        <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
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
