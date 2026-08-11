import { useTagVaultState } from '../hooks/useTagVaultState';
import { getTagVaultEmptyState } from '../utils/tagVault';
import StoredVideoActionGrid from './StoredVideoActionGrid';
import StoredVideoLoadFeedback from './StoredVideoLoadFeedback';
import TagVaultFilters from './TagVaultFilters';
import TagVaultHeader from './TagVaultHeader';
import TagVaultSummary from './TagVaultSummary';

export default function TagVaultWorkspace({
  channels,
  checkedVideos,
  isProductionCandidate,
  isVideoSaved,
  loadResult,
  loading = false,
  onFetchComments,
  onLoadStoredVideos,
  onOpenChannelWatchlist,
  onOpenChannels,
  onOpenCollectedVideos,
  onOpenSelectedScan,
  onPromoteToProduction,
  onSelectTagChannels,
  onToggleCheck,
  onToggleScrap,
  selectedChannelIds,
  videos,
}) {
  const state = useTagVaultState({ channels, selectedChannelIds, videos });
  const emptyState = getTagVaultEmptyState({
    channelCount: Array.isArray(channels) ? channels.length : 0,
    hasActiveFilters: state.hasActiveFilters,
    loadedVideoCount: state.summary.loadedVideoCount,
    selectedChannelCount: state.summary.selectedChannelCount,
    tagCount: state.summary.tagCount,
  });
  const handleEmptyAction = emptyState.action === 'channels'
    ? onOpenChannels
    : emptyState.action === 'load'
      ? onLoadStoredVideos
      : emptyState.action === 'reset'
        ? state.resetFilters
        : () => onSelectTagChannels(state.selectedFacet?.channelIds || []);

  return (
    <section data-testid="creator-route-tag-vault" className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-slate-950/30 sm:p-6">
      <TagVaultHeader
        loading={loading}
        onLoadStoredVideos={onLoadStoredVideos}
        onOpenChannels={onOpenChannels}
        onOpenCollectedVideos={onOpenCollectedVideos}
        selectedChannelCount={state.summary.selectedChannelCount}
      />

      <div className="mt-5 space-y-4">
        <TagVaultSummary summary={state.summary} />
        {state.facets.length > 0 && (
          <TagVaultFilters
            facets={state.facets}
            hasActiveFilters={state.hasActiveFilters}
            lengthFilter={state.lengthFilter}
            onChangeLengthFilter={state.setLengthFilter}
            onChangeSearchQuery={state.setSearchQuery}
            onChangeSelectedTag={state.setSelectedTag}
            onChangeSortType={state.setSortType}
            onReset={state.resetFilters}
            onSelectTagChannels={onSelectTagChannels}
            searchQuery={state.searchQuery}
            selectedFacet={state.selectedFacet}
            selectedTag={state.effectiveTag}
            sortType={state.sortType}
          />
        )}

        {state.summary.loadedVideoCount > 0 && loadResult?.success !== true && loadResult && (
          <StoredVideoLoadFeedback
            loadResult={loadResult}
            loading={loading}
            onOpenChannelWatchlist={onOpenChannelWatchlist}
            onOpenSelectedScan={onOpenSelectedScan}
            onRetry={onLoadStoredVideos}
          />
        )}

        {state.displayedVideos.length > 0 ? (
          <>
            <p className="text-xs text-slate-400">
              <strong className="text-emerald-300">#{state.effectiveTag}</strong> 수집 영상 {state.summary.matchedVideoCount.toLocaleString()}개 중 {state.summary.shownVideoCount.toLocaleString()}개를 표시합니다.
            </p>
            <StoredVideoActionGrid
              checkedVideos={checkedVideos}
              isProductionCandidate={isProductionCandidate}
              isVideoSaved={isVideoSaved}
              onFetchComments={onFetchComments}
              onPromoteToProduction={onPromoteToProduction}
              onToggleCheck={onToggleCheck}
              onToggleScrap={onToggleScrap}
              videos={state.displayedVideos}
            />
          </>
        ) : state.summary.loadedVideoCount === 0 && loadResult ? (
          <StoredVideoLoadFeedback
            loadResult={loadResult}
            loading={loading}
            onOpenChannelWatchlist={onOpenChannelWatchlist}
            onOpenSelectedScan={onOpenSelectedScan}
            onRetry={onLoadStoredVideos}
          />
        ) : (
          <div className="border border-dashed border-slate-700 bg-slate-950/40 px-5 py-12 text-center">
            <h3 className="text-base font-extrabold text-white">{emptyState.title}</h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">{emptyState.description}</p>
            {emptyState.action !== 'load' && (
              <button
                type="button"
                onClick={handleEmptyAction}
                title={emptyState.actionTitle}
                aria-label={emptyState.actionAriaLabel || emptyState.actionLabel}
                className="mt-4 rounded-lg bg-white px-4 py-2 text-xs font-extrabold text-slate-950"
              >
                {emptyState.actionLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
