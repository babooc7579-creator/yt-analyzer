import { getHomeRadarWorkflowSectionHeaderProps } from '../utils/homeRadarWorkflowSection';
import HomeRadarChannelStage from './HomeRadarChannelStage';
import HomeRadarJourney from './HomeRadarJourney';

export default function HomeRadarWorkflowSection({
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  loadedVideoCount,
  onOpenAddChannel,
  onOpenChannelWatchlist,
  onLoadStoredVideos,
  onOpenDiscoveryLinks,
  onOpenProductionCandidates,
  onOpenSelectedScan,
  onOpenTtoTto,
  onOpenVault,
  openRadarCandidateCount,
  productionCandidateCount,
  productionFocusCount,
  savedChannels,
  savedChannelCount = 0,
  selectedChannelIds,
  selectedChannelCount = 0,
  selectedLoadedVideoCount = 0,
  storedVideoLoadResult,
  storedVideoLoadPending,
  toggleChannelSelection,
}) {
  const headerProps = getHomeRadarWorkflowSectionHeaderProps();

  return (
    <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-extrabold text-indigo-200">{headerProps.eyebrow}</p>
          <p className="mt-1 text-sm text-slate-400">{headerProps.description}</p>
        </div>
        <p className="text-[11px] font-bold text-emerald-200">{headerProps.safetyNote}</p>
      </div>
      <HomeRadarJourney
        loadedVideoCount={loadedVideoCount}
        openRadarCandidateCount={openRadarCandidateCount}
        productionCandidateCount={productionCandidateCount}
        selectedChannelCount={selectedChannelCount}
        storedVideoLoadResult={storedVideoLoadResult}
        storedVideoLoadPending={storedVideoLoadPending}
      />
      <HomeRadarChannelStage
        onLoadStoredVideos={onLoadStoredVideos}
        onOpenAddChannel={onOpenAddChannel}
        onOpenChannelWatchlist={onOpenChannelWatchlist}
        onOpenSelectedScan={onOpenSelectedScan}
        savedChannels={savedChannels}
        selectedChannelIds={selectedChannelIds}
        selectedLoadedVideoCount={selectedLoadedVideoCount}
        storedVideoLoadResult={storedVideoLoadResult}
        toggleChannelSelection={toggleChannelSelection}
      />
    </div>
  );
}
