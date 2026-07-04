import HomeSummaryCard from './HomeSummaryCard';

export default function HomeRadarStatsGrid({
  latestScanText,
  loadedVideoCount,
  savedChannelCount,
  savedVideoCount,
  ttoTtoAssetCount,
}) {
  return (
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
  );
}
