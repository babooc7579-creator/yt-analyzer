import { Bookmark, Sparkles } from 'lucide-react';

import HomeCandidateWorkflowCard from './HomeCandidateWorkflowCard';
import HomeWorkflowCard from './HomeWorkflowCard';

export default function HomeRadarWorkflowSection({
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  loadedVideoCount,
  onLoadStoredVideos,
  onOpenDiscoveryLinks,
  onOpenProductionCandidates,
  openRadarCandidateCount,
  productionCandidateCount,
  selectedChannelCount = 0,
}) {
  const hasSelectedChannels = selectedChannelCount > 0;
  const loadStoredVideosActionLabel = hasSelectedChannels ? '불러오기' : '채널 선택 필요';
  const loadStoredVideosActionTitle = hasSelectedChannels
    ? `DB 조회: 선택 채널 ${selectedChannelCount}개의 저장된 영상을 불러옵니다. YouTube API를 새로 호출하지 않습니다.`
    : '왼쪽 채널 목록에서 볼 채널을 먼저 체크해야 저장 영상을 불러올 수 있습니다. 이 버튼은 DB 조회용이며 YouTube API를 새로 호출하지 않습니다.';
  const loadStoredVideosActionAriaLabel = hasSelectedChannels
    ? `선택 채널 ${selectedChannelCount}개 저장 영상 불러오기, DB 조회이며 YouTube API 호출 없음`
    : '채널 선택 필요, 왼쪽 채널 목록에서 볼 채널을 먼저 체크하세요';

  return (
    <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-extrabold text-indigo-200">오늘 작업 흐름</p>
          <p className="mt-1 text-sm text-slate-400">저장된 데이터를 먼저 보고, 괜찮은 후보만 제작 후보로 넘깁니다.</p>
        </div>
        <p className="text-[11px] font-bold text-emerald-200">이 영역은 DB 조회 중심입니다. 새 수집은 선택 채널 새 영상 수집 버튼에서만 실행됩니다.</p>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <HomeWorkflowCard
          title="1. 저장된 영상 불러오기"
          description="이미 저장된 영상만 화면에 올립니다. YouTube API를 새로 호출하지 않습니다."
          value={`${loadedVideoCount}개`}
          icon={Bookmark}
          actionLabel={loadStoredVideosActionLabel}
          actionTitle={loadStoredVideosActionTitle}
          actionAriaLabel={loadStoredVideosActionAriaLabel}
          actionDisabled={!hasSelectedChannels}
          onAction={onLoadStoredVideos}
          className="border-blue-400/20 bg-blue-500/10"
          titleClassName="text-blue-100"
          iconClassName="text-blue-200"
          descriptionClassName="text-blue-100/70"
        />
        <HomeWorkflowCard
          title="2. 오늘 후보 판단"
          description="레이더가 먼저 볼 후보를 추려 보여줍니다. 본 영상은 다시 보이지 않게 정리됩니다."
          value={`${openRadarCandidateCount}개 남음`}
          icon={Sparkles}
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
        />
      </div>
    </div>
  );
}
