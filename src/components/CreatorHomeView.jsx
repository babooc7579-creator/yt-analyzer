import { useEffect, useState } from 'react';

import { getCreatorHomeViewProps } from '../utils/creatorHomeViewProps';
import HomeActionShortcuts from './HomeActionShortcuts';
import HomeOperatingGuidelines from './HomeOperatingGuidelines';
import HomeRadarSummary from './HomeRadarSummary';
import HomeWorkspaceShortcuts from './HomeWorkspaceShortcuts';
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
  const [storedVideoLoadResult, setStoredVideoLoadResult] = useState(null);

  useEffect(() => {
    setStoredVideoLoadResult(null);
  }, [selectedChannelKey]);

  const loadStoredVideos = async () => {
    const result = await loadStoredVideosForSelectedChannels?.();
    setStoredVideoLoadResult(result || { success: false, videoCount: 0 });
    return result;
  };

  const {
    actionShortcutsProps,
    radarCandidateStripProps,
    radarSummaryProps,
    workspaceShortcutsProps,
  } = getCreatorHomeViewProps({
    clearRadarDecisions,
    discoveryCandidateCount,
    discoveryRightsWarningCount,
    isVideoSaved,
    latestScanText,
    loadStoredVideosForSelectedChannels: loadStoredVideos,
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
    storedVideoLoadResult,
    toggleScrapVideo,
    ttoTtoAssetCount,
    videoUserRecords,
    videos,
  });

  return (
    <div data-testid="creator-route-home" className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-slate-950/30 sm:p-6">
        <HomeRadarSummary {...radarSummaryProps} />

        <RadarCandidateStrip {...radarCandidateStripProps} />

        <HomeActionShortcuts {...actionShortcutsProps} />

        <HomeWorkspaceShortcuts {...workspaceShortcutsProps} />
      </section>

      <HomeOperatingGuidelines />
    </div>
  );
}
