const toArray = (items) => (Array.isArray(items) ? items : []);

export function buildTagVaultRouteProps({
  checkedVideos,
  fetchTopComments,
  isProductionCandidate,
  isVideoSaved,
  loadStoredVideosForSelectedChannels,
  loading,
  openCreatorView,
  promoteVideoToProduction,
  savedChannels,
  selectedChannelIds,
  setSelectedChannelIds,
  toggleCheckVideo,
  toggleScrapVideo,
  videos,
} = {}) {
  const normalizedSelectedChannelIds = toArray(selectedChannelIds);

  return {
    channels: toArray(savedChannels),
    checkedVideos: toArray(checkedVideos),
    isProductionCandidate,
    isVideoSaved,
    loading: Boolean(loading),
    onFetchComments: fetchTopComments,
    onLoadStoredVideos: loadStoredVideosForSelectedChannels,
    onOpenChannelWatchlist: () => openCreatorView({ id: 'discovery-watchlist' }),
    onOpenChannels: () => openCreatorView({ id: 'ops-channels' }),
    onOpenSelectedScan: () => openCreatorView({
      id: 'ops-channels',
      intent: { operationStage: 'scan' },
    }),
    onPromoteToProduction: promoteVideoToProduction,
    onSelectTagChannels: (channelIds) => setSelectedChannelIds(toArray(channelIds)),
    onToggleCheck: toggleCheckVideo,
    onToggleScrap: toggleScrapVideo,
    selectedChannelIds: normalizedSelectedChannelIds,
    selectedChannelKey: [...normalizedSelectedChannelIds].sort().join('|'),
    videos: toArray(videos),
  };
}
