import { RefreshCw, Rocket } from 'lucide-react';

import { getDiscoveryLinksHeaderActionsViewProps } from '../utils/discoveryLinksCopy';
import CopyUrlButton from './CopyUrlButton';

export default function DiscoveryLinksHeaderActions({
  filteredLinkCount,
  loading,
  onOpenProductionCandidates,
  onRefresh,
  saving,
  urlList,
}) {
  const {
    copyUrlButtonProps,
    isRefreshing,
    productionCandidatesButtonLabel,
    productionCandidatesButtonProps,
    refreshButtonLabel,
    refreshButtonProps,
  } = getDiscoveryLinksHeaderActionsViewProps({
    filteredLinkCount,
    loading,
    onOpenProductionCandidates,
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
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 text-xs font-extrabold text-indigo-600 shadow-sm transition hover:bg-indigo-100 disabled:opacity-50"
        {...productionCandidatesButtonProps}
      >
        <Rocket className="h-4 w-4" />
        {productionCandidatesButtonLabel}
      </button>
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
