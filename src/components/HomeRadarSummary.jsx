import { Sparkles } from 'lucide-react';

import HomeRadarWorkflowSection from './HomeRadarWorkflowSection';
import HomeSummaryCard from './HomeSummaryCard';

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
