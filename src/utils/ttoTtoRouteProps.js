const toArray = (items) => (Array.isArray(items) ? items : []);

export function buildTtoTtoRouteProps({
  isVideoSaved,
  loadStoredVideosForSelectedChannels,
  loading,
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
  const normalizedSelectedChannelIds = toArray(selectedChannelIds);

  return {
    isVideoSaved,
    loading: Boolean(loading),
    onLoadStoredVideos: loadStoredVideosForSelectedChannels,
    onMarkVideoStatus: markRadarVideoStatus,
    onOpenChannelWatchlist: () => openCreatorView({ id: 'discovery-watchlist' }),
    onOpenProductionCandidates: () => openCreatorView({ id: 'studio-candidates' }),
    onOpenScrapbook: () => openCreatorView({ id: 'studio-scrapbook' }),
    onOpenSelectedScan: () => openCreatorView({
      id: 'ops-channels',
      intent: { operationStage: 'scan' },
    }),
    onOpenVault: () => openCreatorView({ id: 'vault-videos' }),
    onPromoteToProduction: promoteVideoToProduction,
    onRestoreVideo: restoreVideoToRadar,
    onToggleScrap: toggleScrapVideo,
    savedVideos: toArray(savedVideos),
    selectedChannelCount: normalizedSelectedChannelIds.length,
    selectedChannelKey: [...normalizedSelectedChannelIds].sort().join('|'),
    videoUserRecords,
    videos: toArray(videos),
  };
}
