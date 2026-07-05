import { getCreatorHomeViewProps } from '../utils/creatorHomeViewProps';
import HomeActionShortcuts from './HomeActionShortcuts';
import HomeOperatingGuidelines from './HomeOperatingGuidelines';
import HomeRadarSummary from './HomeRadarSummary';
import RadarCandidateStrip from './RadarCandidateStrip';

export default function CreatorHomeView({
  clearRadarDecisions,
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  isVideoSaved,
  latestScanText,
  loadStoredVideosForSelectedChannels,
  markRadarVideoStatus,
  openRadarCandidateCount,
  onOpenView,
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
  const {
    actionShortcutsProps,
    radarCandidateStripProps,
    radarSummaryProps,
  } = getCreatorHomeViewProps({
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
  });

  return (
    <div data-testid="creator-route-home" className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/30">
        <HomeRadarSummary {...radarSummaryProps} />

        <RadarCandidateStrip {...radarCandidateStripProps} />

        <HomeActionShortcuts {...actionShortcutsProps} />
      </section>

      <HomeOperatingGuidelines />
    </div>
  );
}
