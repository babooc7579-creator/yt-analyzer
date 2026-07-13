const toArray = (items) => (Array.isArray(items) ? items : []);

export function buildKeywordExplorerRouteProps({
  checkedVideos,
  fetchTopComments,
  isProductionCandidate,
  isVideoSaved,
  loadStoredVideosForSelectedChannels,
  openCreatorView,
  promoteVideoToProduction,
  selectedChannelIds,
  toggleCheckVideo,
  toggleScrapVideo,
  videos,
} = {}) {
  return {
    checkedVideos: toArray(checkedVideos),
    isProductionCandidate,
    isVideoSaved,
    onFetchComments: fetchTopComments,
    onLoadStoredVideos: loadStoredVideosForSelectedChannels,
    onOpenVault: () => openCreatorView({ id: 'vault-videos' }),
    onPromoteToProduction: promoteVideoToProduction,
    onToggleCheck: toggleCheckVideo,
    onToggleScrap: toggleScrapVideo,
    selectedChannelCount: toArray(selectedChannelIds).length,
    videos: toArray(videos),
  };
}
