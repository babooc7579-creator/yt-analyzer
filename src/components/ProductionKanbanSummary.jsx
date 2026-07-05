import ProductionKanbanSummaryLegend from './ProductionKanbanSummaryLegend';
import ProductionKanbanSummaryMetrics from './ProductionKanbanSummaryMetrics';

export default function ProductionKanbanSummary({
  discoveryLinkCandidateCount,
  productionSummary,
  videoCount,
}) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-white p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-extrabold text-indigo-700">제작 칸반</p>
          <h3 className="mt-1 text-xl font-extrabold text-slate-900">제작 후보만 다음 행동으로 넘깁니다</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            스크랩북 전체가 아니라, 레이더와 발견함에서 제작 후보로 지정한 항목만 보여줍니다.
            저장된 데이터 기준이며 YouTube API를 새로 호출하지 않습니다.
          </p>
        </div>
        <p className="text-xs font-semibold text-slate-500">
          영상 {videoCount}개 관리 · 링크 {discoveryLinkCandidateCount}개 후보
        </p>
      </div>
      <ProductionKanbanSummaryMetrics
        discoveryLinkCandidateCount={discoveryLinkCandidateCount}
        productionSummary={productionSummary}
      />
      <ProductionKanbanSummaryLegend />
    </div>
  );
}
