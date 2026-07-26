const toArray = (items) => (Array.isArray(items) ? items : []);

export function buildKeywordExplorerRouteProps({
  checkedVideos,
  fetchTopComments,
  isProductionCandidate,
  isVideoSaved,
  loadStoredVideosForSelectedChannels,
  loading,
  openCreatorView,
  promoteVideoToProduction,
  selectedChannelIds,
  toggleCheckVideo,
  toggleScrapVideo,
  videos,
} = {}) {
  const normalizedSelectedChannelIds = toArray(selectedChannelIds);

  return {
    checkedVideos: toArray(checkedVideos),
    isProductionCandidate,
    isVideoSaved,
    loading: Boolean(loading),
    onFetchComments: fetchTopComments,
    onLoadStoredVideos: loadStoredVideosForSelectedChannels,
    onOpenChannelWatchlist: () => openCreatorView({ id: 'discovery-watchlist' }),
    onOpenSelectedScan: () => openCreatorView({
      id: 'ops-channels',
      intent: { operationStage: 'scan' },
    }),
    onOpenWorkTools: () => openCreatorView({ id: 'tools-bookmarks' }),
    onOpenVault: () => openCreatorView({ id: 'vault-videos' }),
    onPromoteToProduction: promoteVideoToProduction,
    onToggleCheck: toggleCheckVideo,
    onToggleScrap: toggleScrapVideo,
    selectedChannelCount: normalizedSelectedChannelIds.length,
    selectedChannelKey: [...normalizedSelectedChannelIds].sort().join('|'),
    videos: toArray(videos),
  };
}
