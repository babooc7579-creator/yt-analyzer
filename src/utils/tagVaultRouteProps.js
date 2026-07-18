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
  return {
    channels: toArray(savedChannels),
    checkedVideos: toArray(checkedVideos),
    isProductionCandidate,
    isVideoSaved,
    loading: Boolean(loading),
    onFetchComments: fetchTopComments,
    onLoadStoredVideos: loadStoredVideosForSelectedChannels,
    onOpenChannels: () => openCreatorView({ id: 'ops-channels' }),
    onPromoteToProduction: promoteVideoToProduction,
    onSelectTagChannels: (channelIds) => setSelectedChannelIds(toArray(channelIds)),
    onToggleCheck: toggleCheckVideo,
    onToggleScrap: toggleScrapVideo,
    selectedChannelIds: toArray(selectedChannelIds),
    videos: toArray(videos),
  };
}
