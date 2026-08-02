const toArray = (items) => (Array.isArray(items) ? items : []);

export function buildKeywordExplorerRouteProps({
  addDiscoveryLink,
  checkedVideos,
  discoveryLinks,
  discoveryLinksSaving,
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
    discoveryLinks: toArray(discoveryLinks),
    discoveryLinksSaving: Boolean(discoveryLinksSaving),
    isProductionCandidate,
    isVideoSaved,
    loading: Boolean(loading),
    onFetchComments: fetchTopComments,
    onLoadStoredVideos: loadStoredVideosForSelectedChannels,
    onOpenDiscoveryLinks: () => openCreatorView({ id: 'discovery-links' }),
    onOpenChannelWatchlist: () => openCreatorView({ id: 'discovery-watchlist' }),
    onOpenSelectedScan: () => openCreatorView({
      id: 'ops-channels',
      intent: { operationStage: 'scan' },
    }),
    onOpenWorkTools: () => openCreatorView({ id: 'tools-bookmarks' }),
    onOpenVault: () => openCreatorView({ id: 'vault-videos' }),
    onPromoteToProduction: promoteVideoToProduction,
    onSaveDiscoveryLink: addDiscoveryLink,
    onToggleCheck: toggleCheckVideo,
    onToggleScrap: toggleScrapVideo,
    selectedChannelCount: normalizedSelectedChannelIds.length,
    selectedChannelKey: [...normalizedSelectedChannelIds].sort().join('|'),
    videos: toArray(videos),
  };
}
