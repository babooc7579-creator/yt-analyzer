import { useTtoTtoExplorerState } from '../hooks/useTtoTtoExplorerState';
import { getTtoTtoExplorerEmptyState } from '../utils/ttoTtoExplorer';
import RadarCandidateGrid from './RadarCandidateGrid';
import RadarDecisionPanel from './RadarDecisionPanel';
import StoredVideoLoadFeedback from './StoredVideoLoadFeedback';
import TtoTtoExplorerEmptyState from './TtoTtoExplorerEmptyState';
import TtoTtoExplorerFilters from './TtoTtoExplorerFilters';
import TtoTtoExplorerHeader from './TtoTtoExplorerHeader';
import TtoTtoExplorerSummary from './TtoTtoExplorerSummary';

export default function TtoTtoExplorerWorkspace({
  isVideoSaved,
  loadResult,
  loading = false,
  onLoadStoredVideos,
  onMarkVideoStatus,
  onOpenChannelWatchlist,
  onOpenProductionCandidates,
  onOpenScrapbook,
  onOpenSelectedScan,
  onOpenVault,
  onPromoteToProduction,
  onRestoreVideo,
  onToggleScrap,
  savedVideos,
  selectedChannelCount,
  videoUserRecords,
  videos,
}) {
  const {
    decisionGroups,
    decisionSummary,
    filteredCandidates,
    hasActiveFilters,
    lengthFilter,
    loadedDecisionCount,
    minimumViews,
    resetFilters,
    searchQuery,
    setLengthFilter,
    setMinimumViews,
    setSearchQuery,
    setSortType,
    sortType,
    summary,
  } = useTtoTtoExplorerState({ videoUserRecords, videos });
  const emptyState = getTtoTtoExplorerEmptyState({
    hasActiveFilters,
    loadedVideoCount: summary.loadedVideoCount,
    openCandidateCount: summary.openCandidateCount,
    selectedChannelCount,
  });
  const handleEmptyAction = emptyState?.kind === 'filtered'
    ? resetFilters
    : summary.loadedVideoCount === 0 && selectedChannelCount > 0
      ? onLoadStoredVideos
      : onOpenVault;

  return (
    <section data-testid="creator-route-ttotto" className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-slate-950/30 sm:p-6">
      <TtoTtoExplorerHeader
        onOpenProductionCandidates={onOpenProductionCandidates}
        onOpenScrapbook={onOpenScrapbook}
        onOpenVault={onOpenVault}
      />

      <div className="mt-5 space-y-4">
        <TtoTtoExplorerSummary summary={summary} />

        <TtoTtoExplorerFilters
          hasActiveFilters={hasActiveFilters}
          lengthFilter={lengthFilter}
          minimumViews={minimumViews}
          onChangeLengthFilter={setLengthFilter}
          onChangeMinimumViews={setMinimumViews}
          onChangeSearchQuery={setSearchQuery}
          onChangeSortType={setSortType}
          onResetFilters={resetFilters}
          searchQuery={searchQuery}
          sortType={sortType}
        />

        <p className="text-xs text-slate-400">
          현재 표시 {filteredCandidates.length}개 · 스크랩북 {Array.isArray(savedVideos) ? savedVideos.length : 0}개 · 판단 버튼은 온라인 저장소(Azure DB)의 사용자 기록에 저장됩니다.
        </p>

        {summary.loadedVideoCount > 0 && loadResult?.success !== true && loadResult && (
          <StoredVideoLoadFeedback
            loadResult={loadResult}
            loading={loading}
            onOpenChannelWatchlist={onOpenChannelWatchlist}
            onOpenSelectedScan={onOpenSelectedScan}
            onRetry={onLoadStoredVideos}
          />
        )}

        {filteredCandidates.length > 0 ? (
          <RadarCandidateGrid
            candidates={filteredCandidates}
            isVideoSaved={isVideoSaved}
            onMarkVideoStatus={onMarkVideoStatus}
            onPromoteToProduction={onPromoteToProduction}
            onToggleScrap={onToggleScrap}
          />
        ) : summary.loadedVideoCount === 0 && loadResult ? (
          <StoredVideoLoadFeedback
            loadResult={loadResult}
            loading={loading}
            onOpenChannelWatchlist={onOpenChannelWatchlist}
            onOpenSelectedScan={onOpenSelectedScan}
            onRetry={onLoadStoredVideos}
          />
        ) : (
          <TtoTtoExplorerEmptyState
            emptyState={emptyState}
            loading={loading && summary.loadedVideoCount === 0 && selectedChannelCount > 0}
            onAction={handleEmptyAction}
          />
        )}

        <RadarDecisionPanel
          decisionGroups={decisionGroups}
          decisionSummary={decisionSummary}
          loadedDecisionCount={loadedDecisionCount}
          onRestoreVideo={onRestoreVideo}
        />
      </div>
    </section>
  );
}
