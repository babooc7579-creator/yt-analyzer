import { RefreshCw } from 'lucide-react';

import { getDiscoveryLinksHeaderActionsViewProps } from '../utils/discoveryLinksCopy';
import CopyUrlButton from './CopyUrlButton';

export default function DiscoveryLinksHeaderActions({
  filteredLinkCount,
  loading,
  onRefresh,
  saving,
  urlList,
}) {
  const {
    copyUrlButtonProps,
    isRefreshing,
    refreshButtonLabel,
    refreshButtonProps,
  } = getDiscoveryLinksHeaderActionsViewProps({
    filteredLinkCount,
    loading,
    onRefresh,
    saving,
    urlList,
  });

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <CopyUrlButton
        {...copyUrlButtonProps}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:text-slate-300"
        iconClassName="h-4 w-4"
      />
      <button
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        {...refreshButtonProps}
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        {refreshButtonLabel}
      </button>
    </div>
  );
}
