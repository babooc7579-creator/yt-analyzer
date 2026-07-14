import { Bookmark, Sparkles } from 'lucide-react';

import { getLoadStoredVideosActionProps } from '../utils/loadStoredVideosActionProps';
import {
  getHomeRadarWorkflowCards,
  getHomeRadarWorkflowSectionHeaderProps,
} from '../utils/homeRadarWorkflowSection';
import HomeCandidateWorkflowCard from './HomeCandidateWorkflowCard';
import HomeNextActionPanel from './HomeNextActionPanel';
import HomeRadarJourney from './HomeRadarJourney';
import HomeWorkflowCard from './HomeWorkflowCard';

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
  savedChannelCount = 0,
  selectedChannelCount = 0,
  storedVideoLoadResult,
}) {
  const {
    actionAriaLabel: loadStoredVideosActionAriaLabel,
    actionDisabled: loadStoredVideosActionDisabled,
    actionLabel: loadStoredVideosActionLabel,
    actionTitle: loadStoredVideosActionTitle,
  } = getLoadStoredVideosActionProps({
    onLoad: onLoadStoredVideos,
    selectedChannelCount,
  });
  const headerProps = getHomeRadarWorkflowSectionHeaderProps();
  const [loadStoredVideosCard, judgeRadarCandidatesCard] = getHomeRadarWorkflowCards({
    loadedVideoCount,
    openRadarCandidateCount,
  });

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
      />
      <HomeNextActionPanel
        discoveryCandidateCount={discoveryCandidateCount}
        discoveryRightsWarningCount={discoveryRightsWarningCount}
        loadedVideoCount={loadedVideoCount}
        onLoadStoredVideos={onLoadStoredVideos}
        onOpenAddChannel={onOpenAddChannel}
        onOpenChannelWatchlist={onOpenChannelWatchlist}
        onOpenProductionCandidates={onOpenProductionCandidates}
        onOpenSelectedScan={onOpenSelectedScan}
        onOpenVault={onOpenVault}
        openRadarCandidateCount={openRadarCandidateCount}
        productionCandidateCount={productionCandidateCount}
        productionFocusCount={productionFocusCount}
        savedChannelCount={savedChannelCount}
        selectedChannelCount={selectedChannelCount}
        storedVideoLoadResult={storedVideoLoadResult}
      />
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <HomeWorkflowCard
          title={loadStoredVideosCard.title}
          description={loadStoredVideosCard.description}
          value={loadStoredVideosCard.value}
          icon={Bookmark}
          actionLabel={loadStoredVideosActionLabel}
          actionTitle={loadStoredVideosActionTitle}
          actionAriaLabel={loadStoredVideosActionAriaLabel}
          actionDisabled={loadStoredVideosActionDisabled}
          onAction={onLoadStoredVideos}
          className="border-blue-400/20 bg-blue-500/10"
          titleClassName="text-blue-100"
          iconClassName="text-blue-200"
          descriptionClassName="text-blue-100/70"
        />
        <HomeWorkflowCard
          title={judgeRadarCandidatesCard.title}
          description={judgeRadarCandidatesCard.description}
          value={judgeRadarCandidatesCard.value}
          icon={Sparkles}
          actionLabel="터또터 탐색 열기"
          actionTitle="현재 불러온 Cloud 저장 영상에서 터또터 후보를 검색·필터·정렬합니다. YouTube API 호출은 없습니다."
          actionAriaLabel="터또터 탐색 전용 화면 열기, 새 YouTube API 호출 없음"
          onAction={onOpenTtoTto}
          className="border-rose-400/20 bg-rose-500/10"
          titleClassName="text-rose-100"
          iconClassName="text-rose-200"
          descriptionClassName="text-rose-100/70"
        />
        <HomeCandidateWorkflowCard
          discoveryCandidateCount={discoveryCandidateCount}
          discoveryRightsWarningCount={discoveryRightsWarningCount}
          onOpenDiscoveryLinks={onOpenDiscoveryLinks}
          onOpenProductionCandidates={onOpenProductionCandidates}
          productionCandidateCount={productionCandidateCount}
          productionFocusCount={productionFocusCount}
        />
      </div>
    </div>
  );
}
