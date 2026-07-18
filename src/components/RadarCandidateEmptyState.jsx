import { Bookmark, Database, ListChecks, Loader2, RefreshCw } from 'lucide-react';

import { getLoadStoredVideosActionProps } from '../utils/loadStoredVideosActionProps';
import { getRadarCandidateEmptyStateViewProps } from '../utils/radarCandidateStateProps';

export default function RadarCandidateEmptyState({
  onLoadStoredVideos,
  onOpenChannelWatchlist,
  onOpenSelectedScan,
  onOpenVault,
  selectedChannelCount = 0,
  storedVideoLoadResult,
  storedVideoLoadPending = false,
}) {
  const {
    buttonAriaLabel: loadStoredVideosAriaLabel,
    buttonDisabled: loadStoredVideosDisabled,
    buttonLabel: loadStoredVideosLabel,
    hasSelectedChannels,
    title: loadStoredVideosTitle,
  } = getLoadStoredVideosActionProps({
    loading: storedVideoLoadPending,
    onLoad: onLoadStoredVideos,
    selectedChannelCount,
  });
  const {
    channelWatchlistButtonProps,
    descriptionText,
    hideLoadButton,
    openVaultButtonProps,
    selectedScanButtonProps,
    titleText,
  } = getRadarCandidateEmptyStateViewProps({ selectedChannelCount, storedVideoLoadResult });

  return (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 p-5">
      <p className="text-[11px] font-extrabold text-rose-300">STAGE 3 · 오늘 후보 판단</p>
      <p className="text-sm font-extrabold text-white">{titleText}</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">
        {descriptionText}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {channelWatchlistButtonProps.show && typeof onOpenChannelWatchlist === 'function' ? (
          <button
            type="button"
            onClick={onOpenChannelWatchlist}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-xs font-bold text-white hover:bg-blue-400"
            title={channelWatchlistButtonProps.title}
            aria-label={channelWatchlistButtonProps['aria-label']}
          >
            <ListChecks className="h-4 w-4" /> {channelWatchlistButtonProps.label}
          </button>
        ) : null}
        {onLoadStoredVideos && !hideLoadButton && (
          <button
            type="button"
            onClick={onLoadStoredVideos}
            disabled={loadStoredVideosDisabled}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold ${
              hasSelectedChannels && !storedVideoLoadPending
                ? 'bg-blue-500 text-white hover:bg-blue-400'
                : 'cursor-not-allowed bg-slate-800 text-slate-500'
            }`}
            title={loadStoredVideosTitle}
            aria-label={loadStoredVideosAriaLabel}
          >
            {storedVideoLoadPending
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Database className="h-4 w-4" />}
            {loadStoredVideosLabel}
          </button>
        )}
        {selectedScanButtonProps.show && typeof onOpenSelectedScan === 'function' ? (
          <button
            type="button"
            onClick={onOpenSelectedScan}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-100 hover:bg-emerald-500/15"
            title={selectedScanButtonProps.title}
            aria-label={selectedScanButtonProps['aria-label']}
          >
            <RefreshCw className="h-4 w-4" /> {selectedScanButtonProps.label}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onOpenVault}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-200 hover:bg-blue-500/15"
          title={openVaultButtonProps.title}
          aria-label={openVaultButtonProps['aria-label']}
        >
          <Bookmark className="h-4 w-4" /> {openVaultButtonProps.label}
        </button>
      </div>
    </div>
  );
}
