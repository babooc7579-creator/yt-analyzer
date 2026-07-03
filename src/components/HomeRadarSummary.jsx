import { Bookmark, Sparkles } from 'lucide-react';

import HomeCandidateWorkflowCard from './HomeCandidateWorkflowCard';
import HomeSummaryCard from './HomeSummaryCard';
import HomeWorkflowCard from './HomeWorkflowCard';

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
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-indigo-500/15 p-4">
          <Sparkles className="h-8 w-8 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-extrabold text-indigo-300">오늘의 레이더</p>
          <h3 className="mt-1 text-2xl font-extrabold text-white">오늘 볼 소재와 다음 행동을 먼저 정합니다</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">발굴 → 수집 → 보관 → 분석 → 제작 → 축적 흐름으로 레퍼런스 자산을 운영합니다.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <HomeSummaryCard
          label="저장된 채널"
          value={savedChannelCount}
          description="레퍼런스를 모으는 채널 자산"
        />
        <HomeSummaryCard
          label="불러온 영상"
          value={loadedVideoCount}
          description="현재 보드에 올라온 영상"
        />
        <HomeSummaryCard
          label="스크랩 소재"
          value={savedVideoCount}
          description="제작 후보로 남긴 영상"
        />
        <HomeSummaryCard
          label="최근 수집 상태"
          value={latestScanText}
          description="채널의 마지막 수집 기록 기준"
          className="border-emerald-500/20 bg-emerald-950/30"
          labelClassName="text-emerald-300"
          descriptionClassName="text-emerald-100/70"
          valueClassName="text-lg"
        />
        <HomeSummaryCard
          label="터또터 후보"
          value={ttoTtoAssetCount}
          description="노출이 멈춘 검증된 영상"
          className="border-rose-500/20 bg-rose-950/30"
          labelClassName="text-rose-300"
          descriptionClassName="text-rose-100/70"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-extrabold text-indigo-200">오늘 작업 흐름</p>
            <p className="mt-1 text-sm text-slate-400">저장된 데이터를 먼저 보고, 괜찮은 후보만 제작 후보로 넘깁니다.</p>
          </div>
          <p className="text-[11px] font-bold text-emerald-200">이 영역은 DB 조회 중심입니다. 새 수집은 선택 스캔 버튼에서만 실행됩니다.</p>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <HomeWorkflowCard
            title="1. 저장된 영상 불러오기"
            description="이미 저장된 영상만 화면에 올립니다. YouTube API를 새로 호출하지 않습니다."
            value={`${loadedVideoCount}개`}
            icon={Bookmark}
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
    </>
  );
}
