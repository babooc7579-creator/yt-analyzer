import { useCallback, useState } from 'react';
import { useKeywordExplorerState } from '../hooks/useKeywordExplorerState';
import { getKeywordExplorerEmptyState } from '../utils/keywordExplorer';
import KeywordExplorerFilters from './KeywordExplorerFilters';
import KeywordExplorerHeader from './KeywordExplorerHeader';
import KeywordExplorerSummary from './KeywordExplorerSummary';
import KeywordExplorerSourceTabs from './KeywordExplorerSourceTabs';
import KeywordResearchShortcuts from './KeywordResearchShortcuts';
import KeywordSuggestionChips from './KeywordSuggestionChips';
import StoredVideoActionGrid from './StoredVideoActionGrid';
import StoredVideoLoadFeedback from './StoredVideoLoadFeedback';
import YoutubeKeywordSearchPanel from './YoutubeKeywordSearchPanel';

export default function KeywordExplorerWorkspace({
  checkedVideos,
  discoveryLinks,
  discoveryLinksSaving,
  isProductionCandidate,
  isVideoSaved,
  keywordExplorerSession,
  loadResult,
  loading = false,
  onFetchComments,
  onLoadStoredVideos,
  onOpenDiscoveryLinks,
  onOpenChannelWatchlist,
  onOpenSelectedScan,
  onOpenWorkTools,
  onOpenVault,
  onKeywordExplorerSessionChange,
  onPromoteToProduction,
  onPrepareBulkChannelRegistration,
  onPrepareChannelRegistration,
  onSaveDiscoveryLink,
  onToggleCheck,
  onToggleScrap,
  selectedChannelCount,
  registeredChannelIds,
  videos,
}) {
  const [source, setSource] = useState(keywordExplorerSession?.source || 'stored');
  const handleSourceChange = useCallback((nextSource) => {
    setSource(nextSource);
    onKeywordExplorerSessionChange?.('source', nextSource);
  }, [onKeywordExplorerSessionChange]);
  const handleVideoSearchSessionChange = useCallback((nextSession) => {
    onKeywordExplorerSessionChange?.('videoSearch', nextSession);
  }, [onKeywordExplorerSessionChange]);
  const handleChannelSearchSessionChange = useCallback((nextSession) => {
    onKeywordExplorerSessionChange?.('channelSearch', nextSession);
  }, [onKeywordExplorerSessionChange]);
  const handleSearchTargetChange = useCallback((nextTarget) => {
    onKeywordExplorerSessionChange?.('searchTarget', nextTarget);
  }, [onKeywordExplorerSessionChange]);
  const state = useKeywordExplorerState({ videos });
  const emptyState = getKeywordExplorerEmptyState({
    hasQuery: state.hasQuery,
    loadedVideoCount: state.summary.loadedVideoCount,
    selectedChannelCount,
  });
  const handleEmptyAction = emptyState.action === 'load'
    ? onLoadStoredVideos
    : emptyState.action === 'channels'
      ? onOpenChannelWatchlist
      : state.resetFilters;

  return (
    <section data-testid="creator-route-keyword-explorer" className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-slate-950/30 sm:p-6">
      <KeywordExplorerSourceTabs source={source} onChange={handleSourceChange} />

      <div className="mt-5 space-y-4">
        {source === 'youtube' ? (
          <YoutubeKeywordSearchPanel
            discoveryLinks={discoveryLinks}
            discoveryLinksSaving={discoveryLinksSaving}
            onOpenDiscoveryLinks={onOpenDiscoveryLinks}
            onPrepareBulkChannelRegistration={onPrepareBulkChannelRegistration}
            onPrepareChannelRegistration={onPrepareChannelRegistration}
            onSaveDiscoveryLink={onSaveDiscoveryLink}
            onChannelSearchSessionChange={handleChannelSearchSessionChange}
            onSearchTargetChange={handleSearchTargetChange}
            onVideoSearchSessionChange={handleVideoSearchSessionChange}
            registeredChannelIds={registeredChannelIds}
            searchTargetSession={keywordExplorerSession?.searchTarget}
            channelSearchSession={keywordExplorerSession?.channelSearch}
            videoSearchSession={keywordExplorerSession?.videoSearch}
          />
        ) : (
          <>
        <KeywordExplorerHeader
          loading={loading}
          onLoadStoredVideos={onLoadStoredVideos}
          onOpenVault={onOpenVault}
          selectedChannelCount={selectedChannelCount}
        />
        <KeywordExplorerSummary summary={state.summary} />
        <KeywordExplorerFilters
          ageFilter={state.ageFilter}
          hasActiveFilters={state.hasActiveFilters}
          lengthFilter={state.lengthFilter}
          minimumViews={state.minimumViews}
          onChangeAgeFilter={state.setAgeFilter}
          onChangeLengthFilter={state.setLengthFilter}
          onChangeMinimumViews={state.setMinimumViews}
          onChangeSearchQuery={state.setSearchQuery}
          onChangeSortType={state.setSortType}
          onReset={state.resetFilters}
          searchQuery={state.searchQuery}
          sortType={state.sortType}
        />
        <KeywordSuggestionChips onSelect={state.setSearchQuery} suggestions={state.suggestions} />
        <KeywordResearchShortcuts keyword={state.searchQuery} onOpenWorkTools={onOpenWorkTools} />

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
              전체 검색 결과 {state.summary.matchedVideoCount.toLocaleString()}개 중 {state.summary.shownVideoCount.toLocaleString()}개를 표시합니다.
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
            {emptyState.action !== 'none' && (
              <button
                type="button"
                onClick={handleEmptyAction}
                disabled={emptyState.action === 'load' && loading}
                title={emptyState.actionTitle}
                aria-label={emptyState.actionAriaLabel || emptyState.actionLabel}
                className="mt-4 rounded-lg bg-white px-4 py-2 text-xs font-extrabold text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                {emptyState.action === 'load' && loading ? '수집 영상 불러오는 중...' : emptyState.actionLabel}
              </button>
            )}
          </div>
        )}
          </>
        )}
      </div>
    </section>
  );
}
