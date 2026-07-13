import { Bookmark, Database, ListChecks } from 'lucide-react';

import { getLoadStoredVideosActionProps } from '../utils/loadStoredVideosActionProps';
import { getRadarCandidateEmptyStateViewProps } from '../utils/radarCandidateStateProps';

export default function RadarCandidateEmptyState({
  onLoadStoredVideos,
  onOpenChannelWatchlist,
  onOpenVault,
  selectedChannelCount = 0,
}) {
  const {
    actionAriaLabel: loadStoredVideosAriaLabel,
    actionDisabled: loadStoredVideosDisabled,
    emptyStateLabel: loadStoredVideosLabel,
    hasSelectedChannels,
    title: loadStoredVideosTitle,
  } = getLoadStoredVideosActionProps({
    onLoad: onLoadStoredVideos,
    selectedChannelCount,
  });
  const {
    channelWatchlistButtonProps,
    descriptionText,
    openVaultButtonProps,
    titleText,
  } = getRadarCandidateEmptyStateViewProps({ selectedChannelCount });

  return (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 p-5">
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
        {onLoadStoredVideos && (
          <button
            type="button"
            onClick={onLoadStoredVideos}
            disabled={loadStoredVideosDisabled}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold ${
              hasSelectedChannels
                ? 'bg-blue-500 text-white hover:bg-blue-400'
                : 'cursor-not-allowed bg-slate-800 text-slate-500'
            }`}
            title={loadStoredVideosTitle}
            aria-label={loadStoredVideosAriaLabel}
          >
            <Database className="h-4 w-4" /> {loadStoredVideosLabel}
          </button>
        )}
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
