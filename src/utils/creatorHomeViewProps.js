const toArray = (items) => (Array.isArray(items) ? items : []);

export const getCreatorHomeViewProps = ({
  clearRadarDecisions,
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  isVideoSaved,
  latestScanText,
  loadStoredVideosForSelectedChannels,
  markRadarVideoStatus,
  onOpenView,
  openRadarCandidateCount,
  productionCandidateCount,
  promoteVideoToProduction,
  restoreVideoToRadar,
  savedChannels,
  savedVideos,
  selectedChannelCount,
  toggleScrapVideo,
  ttoTtoAssetCount,
  videoUserRecords,
  videos,
}) => {
  const channelList = toArray(savedChannels);
  const savedVideoList = toArray(savedVideos);
  const videoList = toArray(videos);

  return {
    actionShortcutsProps: {
      onOpenAddChannel: () => onOpenView({ id: 'ops-add-channel' }),
      onOpenDiscoveryLinks: () => onOpenView({ id: 'vault-sources' }),
      onOpenSelectedScan: () => onOpenView({ id: 'ops-selected-scan' }),
      onOpenVault: () => onOpenView({ id: 'vault-all' }),
    },
    radarCandidateStripProps: {
      videos: videoList,
      savedVideos: savedVideoList,
      videoUserRecords,
      isVideoSaved,
      onToggleScrap: toggleScrapVideo,
      onMarkVideoStatus: markRadarVideoStatus,
      onPromoteToProduction: promoteVideoToProduction,
      onRestoreVideo: restoreVideoToRadar,
      onClearDecisions: clearRadarDecisions,
      onLoadStoredVideos: loadStoredVideosForSelectedChannels,
      selectedChannelCount,
      onOpenVault: () => onOpenView({ id: 'vault-all' }),
      onOpenScrapbook: () => onOpenView({ id: 'studio-scrapbook' }),
    },
    radarSummaryProps: {
      savedChannelCount: channelList.length,
      loadedVideoCount: videoList.length,
      savedVideoCount: savedVideoList.length,
      latestScanText,
      onOpenAddChannel: () => onOpenView({ id: 'ops-add-channel' }),
      onLoadStoredVideos: loadStoredVideosForSelectedChannels,
      selectedChannelCount,
      ttoTtoAssetCount,
      openRadarCandidateCount,
      discoveryCandidateCount,
      discoveryRightsWarningCount,
      onOpenDiscoveryLinks: () => onOpenView({ id: 'vault-sources' }),
      onOpenProductionCandidates: () => onOpenView({ id: 'studio-candidates' }),
      onOpenSelectedScan: () => onOpenView({ id: 'ops-selected-scan' }),
      productionCandidateCount,
    },
  };
};
