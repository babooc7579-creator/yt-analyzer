import HomeRadarHero from './HomeRadarHero';
import HomeNextActionPanel from './HomeNextActionPanel';
import HomeRadarStatsGrid from './HomeRadarStatsGrid';
import HomeRadarWorkflowSection from './HomeRadarWorkflowSection';

export default function HomeRadarSummary({
  savedChannelCount,
  loadedVideoCount,
  savedVideoCount,
  latestScanText,
  nextActionProps,
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
  savedChannels,
  selectedChannelIds,
  selectedChannelCount,
  selectedLoadedVideoCount,
  storedVideoLoadResult,
  storedVideoLoadPending,
  toggleChannelSelection,
}) {
  return (
    <>
      <HomeRadarHero
        openRadarCandidateCount={openRadarCandidateCount}
        productionFocusCount={productionFocusCount}
      />

      <HomeNextActionPanel {...nextActionProps} />

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
        savedChannels={savedChannels}
        savedChannelCount={savedChannelCount}
        selectedChannelIds={selectedChannelIds}
        selectedChannelCount={selectedChannelCount}
        selectedLoadedVideoCount={selectedLoadedVideoCount}
        storedVideoLoadResult={storedVideoLoadResult}
        storedVideoLoadPending={storedVideoLoadPending}
        toggleChannelSelection={toggleChannelSelection}
      />

      <details className="mt-4 border border-slate-800 bg-slate-950/40 p-3">
        <summary className="cursor-pointer text-xs font-extrabold text-slate-400 hover:text-white">
          오늘 현황 숫자 보기
        </summary>
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
      </details>
    </>
  );
}
