import { RotateCcw } from 'lucide-react';

export default function VideoToolbarFilterStatus({
  activeFilterCount,
  onResetFilters,
  selectedVideoCount,
}) {
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600"
        title="AI 요청문에 포함하려고 화면에서 선택한 영상 수입니다. API 호출이나 저장 작업은 없습니다."
      >
        화면 선택 {selectedVideoCount}개
      </span>
      {hasActiveFilters && (
        <>
          <span className="rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700">
            필터 {activeFilterCount}개 적용 중
          </span>
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-extrabold text-slate-700 transition hover:bg-slate-50"
            title="검색어, 조회수, 길이, 또터또 조건을 기본값으로 되돌립니다. 영상 선택과 저장 데이터는 바뀌지 않으며 YouTube API를 호출하지 않습니다."
            aria-label={`적용 중인 화면 필터 ${activeFilterCount}개 초기화, 영상 선택 유지, API 호출 없음`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            필터 초기화
          </button>
        </>
      )}
    </div>
  );
}
