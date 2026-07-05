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
  promoteVideoToProduction,
  restoreVideoToRadar,
  savedChannels,
  savedVideos,
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
      promoteVideoToProduction={promoteVideoToProduction}
      restoreVideoToRadar={restoreVideoToRadar}
      savedChannels={savedChannels}
      savedVideos={savedVideos}
      toggleScrapVideo={toggleScrapVideo}
      ttoTtoAssetCount={ttoTtoAssetCount}
      videoUserRecords={videoUserRecords}
      videos={videos}
    />
  );
}
