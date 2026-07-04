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
  onOpenDiscoveryLinks,
  onOpenProductionCandidates,
  productionCandidateCount,
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
        onOpenDiscoveryLinks={onOpenDiscoveryLinks}
        onOpenProductionCandidates={onOpenProductionCandidates}
        openRadarCandidateCount={openRadarCandidateCount}
        productionCandidateCount={productionCandidateCount}
      />
    </>
  );
}
