import CreatorHomeView from './CreatorHomeView';

export default function CreatorHomeRoute({
  channelsLoading,
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
  productionFocusCount,
  promoteVideoToProduction,
  restoreVideoToRadar,
  savedChannels,
  savedVideos,
  selectedChannelIds,
  selectedChannelCount,
  selectedChannelKey,
  toggleChannelSelection,
  toggleScrapVideo,
  ttoTtoAssetCount,
  videoUserRecords,
  videos,
}) {
  return (
    <CreatorHomeView
      channelsLoading={channelsLoading}
      clearRadarDecisions={clearRadarDecisions}
      isVideoSaved={isVideoSaved}
      latestScanText={latestScanText}
      loadStoredVideosForSelectedChannels={loadStoredVideosForSelectedChannels}
      markRadarVideoStatus={markRadarVideoStatus}
      openRadarCandidateCount={openRadarCandidateCount}
      discoveryCandidateCount={discoveryCandidateCount}
      discoveryRightsWarningCount={discoveryRightsWarningCount}
      onOpenView={onOpenView}
      productionCandidateCount={productionCandidateCount}
      productionFocusCount={productionFocusCount}
      promoteVideoToProduction={promoteVideoToProduction}
      restoreVideoToRadar={restoreVideoToRadar}
      savedChannels={savedChannels}
      savedVideos={savedVideos}
      selectedChannelIds={selectedChannelIds}
      selectedChannelCount={selectedChannelCount}
      selectedChannelKey={selectedChannelKey}
      toggleChannelSelection={toggleChannelSelection}
      toggleScrapVideo={toggleScrapVideo}
      ttoTtoAssetCount={ttoTtoAssetCount}
      videoUserRecords={videoUserRecords}
      videos={videos}
    />
  );
}
