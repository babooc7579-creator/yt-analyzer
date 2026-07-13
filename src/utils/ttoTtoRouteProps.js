const toArray = (items) => (Array.isArray(items) ? items : []);

export function buildTtoTtoRouteProps({
  isVideoSaved,
  loadStoredVideosForSelectedChannels,
  markRadarVideoStatus,
  openCreatorView,
  promoteVideoToProduction,
  restoreVideoToRadar,
  savedVideos,
  selectedChannelIds,
  toggleScrapVideo,
  videoUserRecords,
  videos,
} = {}) {
  return {
    isVideoSaved,
    onLoadStoredVideos: loadStoredVideosForSelectedChannels,
    onMarkVideoStatus: markRadarVideoStatus,
    onOpenProductionCandidates: () => openCreatorView({ id: 'studio-candidates' }),
    onOpenScrapbook: () => openCreatorView({ id: 'studio-scrapbook' }),
    onOpenVault: () => openCreatorView({ id: 'vault-videos' }),
    onPromoteToProduction: promoteVideoToProduction,
    onRestoreVideo: restoreVideoToRadar,
    onToggleScrap: toggleScrapVideo,
    savedVideos: toArray(savedVideos),
    selectedChannelCount: toArray(selectedChannelIds).length,
    videoUserRecords,
    videos: toArray(videos),
  };
}
