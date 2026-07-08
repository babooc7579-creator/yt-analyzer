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
  onLoadStoredVideos,
  onOpenDiscoveryLinks,
  onOpenProductionCandidates,
  onOpenSelectedScan,
  onOpenVault,
  productionCandidateCount,
  selectedChannelCount,
}) {
  return (
    <>
      <HomeRadarHero />

      <HomeRadarStatsGrid
        latestScanText={latestScanText}
        loadedVideoCount={loadedVideoCount}
        savedChannelCount={savedChannelCount}
        savedVideoCount={savedVideoCount}
        ttoTtoAssetCount={ttoTtoAssetCount}
      />

      <HomeRadarWorkflowSection
        discoveryCandidateCount={discoveryCandidateCount}
        discoveryRightsWarningCount={discoveryRightsWarningCount}
        loadedVideoCount={loadedVideoCount}
        onOpenAddChannel={onOpenAddChannel}
        onLoadStoredVideos={onLoadStoredVideos}
        onOpenDiscoveryLinks={onOpenDiscoveryLinks}
        onOpenProductionCandidates={onOpenProductionCandidates}
        onOpenSelectedScan={onOpenSelectedScan}
        onOpenVault={onOpenVault}
        openRadarCandidateCount={openRadarCandidateCount}
        productionCandidateCount={productionCandidateCount}
        savedChannelCount={savedChannelCount}
        selectedChannelCount={selectedChannelCount}
      />
    </>
  );
}
