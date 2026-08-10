import { useStoredVideoLoadFeedback } from '../hooks/useStoredVideoLoadFeedback';
import { getCreatorHomeViewProps } from '../utils/creatorHomeViewProps';
import HomeActionShortcuts from './HomeActionShortcuts';
import HomeOperatingGuidelines from './HomeOperatingGuidelines';
import HomeRadarFinishStage from './HomeRadarFinishStage';
import HomeRadarSummary from './HomeRadarSummary';
import HomeWorkspaceShortcuts from './HomeWorkspaceShortcuts';
import RadarCandidateStrip from './RadarCandidateStrip';

export default function CreatorHomeView({
  channelsLoading,
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
  selectedChannelIds,
  selectedChannelCount,
  selectedChannelKey,
  storedVideoLoadResult: sharedStoredVideoLoadResult,
  toggleChannelSelection,
  toggleScrapVideo,
  ttoTtoAssetCount,
  videoUserRecords,
  videos,
}) {
  const {
    loadResult: storedVideoLoadResult,
    loading: storedVideoLoadPending,
    onLoadStoredVideos: loadStoredVideos,
  } = useStoredVideoLoadFeedback({
    onLoad: loadStoredVideosForSelectedChannels,
    selectionKey: selectedChannelKey,
    sharedLoadResult: sharedStoredVideoLoadResult,
  });

  const {
    actionShortcutsProps,
    nextActionProps,
    radarCandidateStripProps,
    radarSummaryProps,
    workspaceShortcutsProps,
  } = getCreatorHomeViewProps({
    channelsLoading,
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
    selectedChannelIds,
    selectedChannelCount,
    storedVideoLoadResult,
    storedVideoLoadPending,
    toggleChannelSelection,
    toggleScrapVideo,
    ttoTtoAssetCount,
    videoUserRecords,
    videos,
  });

  return (
    <div data-testid="creator-route-home" className="space-y-4">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-slate-950/30 sm:p-6">
        <HomeRadarSummary
          {...radarSummaryProps}
          nextActionProps={nextActionProps}
        />

        <RadarCandidateStrip {...radarCandidateStripProps} />

        <HomeRadarFinishStage
          onOpenProductionCandidates={() => onOpenView({ id: 'studio-candidates' })}
          onOpenScriptBoard={() => onOpenView({ id: 'studio-script' })}
          onOpenUploadCalendar={() => onOpenView({ id: 'studio-calendar' })}
          productionCandidateCount={productionCandidateCount}
          productionFocusCount={productionFocusCount}
        />

        <details className="mt-6 border-t border-slate-800 pt-5">
          <summary className="cursor-pointer text-sm font-extrabold text-slate-300 hover:text-white">
            다른 탐색·관리 도구 보기
          </summary>
          <p className="mt-2 text-xs text-slate-500">
            오늘의 소재 판단과 직접 관계없는 도구는 필요할 때만 펼쳐 사용합니다.
          </p>
          <HomeActionShortcuts {...actionShortcutsProps} />
          <HomeWorkspaceShortcuts {...workspaceShortcutsProps} />
        </details>
      </section>

      <details>
        <summary className="cursor-pointer px-1 text-xs font-bold text-slate-500 hover:text-slate-300">
          데이터 조회와 API 사용 기준 보기
        </summary>
        <div className="mt-3">
          <HomeOperatingGuidelines />
        </div>
      </details>
    </div>
  );
}
