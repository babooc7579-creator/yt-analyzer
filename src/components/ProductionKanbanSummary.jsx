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
          <h3 className="mt-1 text-xl font-extrabold text-slate-900">후보를 제작 흐름으로 옮깁니다</h3>
          <p className="mt-1 text-xs text-slate-500">스크랩한 영상과 발견함 링크를 제작 후보, 제작 중, 업로드 완료 흐름으로 관리합니다.</p>
        </div>
        <p className="text-xs font-semibold text-slate-500">영상 {videoCount}개 관리 · 링크 {discoveryLinkCandidateCount}개 후보</p>
      </div>
      <ProductionKanbanSummaryMetrics
        discoveryLinkCandidateCount={discoveryLinkCandidateCount}
        productionSummary={productionSummary}
      />
      <ProductionKanbanSummaryLegend />
    </div>
  );
}
