import CreatorHomeView from './CreatorHomeView';

export default function CreatorHomeRoute({
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
  selectedChannelCount,
  selectedChannelKey,
  toggleScrapVideo,
  ttoTtoAssetCount,
  videoUserRecords,
  videos,
}) {
  return (
    <CreatorHomeView
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
      selectedChannelCount={selectedChannelCount}
      selectedChannelKey={selectedChannelKey}
      toggleScrapVideo={toggleScrapVideo}
      ttoTtoAssetCount={ttoTtoAssetCount}
      videoUserRecords={videoUserRecords}
      videos={videos}
    />
  );
}
