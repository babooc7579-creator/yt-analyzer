export default function ProductionKanbanSummaryLegend() {
  return (
    <div className="mt-3 flex flex-wrap gap-2 border-t border-indigo-50 pt-3 text-[11px] font-bold text-slate-500">
      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">
        영상 기준: Cloud 판단 기록의 제작 상태
      </span>
      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
        링크 기준: 발견함에서 제작 후보로 표시한 링크
      </span>
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
        YouTube API 호출 없음
      </span>
    </div>
  );
}
