import HomeRadarHero from './HomeRadarHero';
import HomeRadarStatsGrid from './HomeRadarStatsGrid';
import HomeRadarWorkflowSection from './HomeRadarWorkflowSection';

export default function HomeRadarSummary({
  savedChannelCount,
  loadedVideoCount,
  savedVideoCount,
  latestScanText,
  ttoTtoAssetCount,
  openRadarCandidateCount,
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  onOpenAddChannel,
  onOpenChannelWatchlist,
  onLoadStoredVideos,
  onOpenDiscoveryLinks,
  onOpenProductionCandidates,
  onOpenSelectedScan,
  onOpenTtoTto,
  onOpenVault,
  productionCandidateCount,
  productionFocusCount,
  selectedChannelCount,
  storedVideoLoadResult,
}) {
  return (
    <>
      <HomeRadarHero />

      <HomeRadarStatsGrid
        discoveryCandidateCount={discoveryCandidateCount}
        discoveryRightsWarningCount={discoveryRightsWarningCount}
        latestScanText={latestScanText}
        loadedVideoCount={loadedVideoCount}
        productionCandidateCount={productionCandidateCount}
        productionFocusCount={productionFocusCount}
        savedChannelCount={savedChannelCount}
        savedVideoCount={savedVideoCount}
        ttoTtoAssetCount={ttoTtoAssetCount}
      />

      <HomeRadarWorkflowSection
        discoveryCandidateCount={discoveryCandidateCount}
        discoveryRightsWarningCount={discoveryRightsWarningCount}
        loadedVideoCount={loadedVideoCount}
        onOpenAddChannel={onOpenAddChannel}
        onOpenChannelWatchlist={onOpenChannelWatchlist}
        onLoadStoredVideos={onLoadStoredVideos}
        onOpenDiscoveryLinks={onOpenDiscoveryLinks}
        onOpenProductionCandidates={onOpenProductionCandidates}
        onOpenSelectedScan={onOpenSelectedScan}
        onOpenTtoTto={onOpenTtoTto}
        onOpenVault={onOpenVault}
        openRadarCandidateCount={openRadarCandidateCount}
        productionCandidateCount={productionCandidateCount}
        productionFocusCount={productionFocusCount}
        savedChannelCount={savedChannelCount}
        selectedChannelCount={selectedChannelCount}
        storedVideoLoadResult={storedVideoLoadResult}
      />
    </>
  );
}
