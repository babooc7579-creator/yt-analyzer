import { RotateCcw, Search } from 'lucide-react';

import { PRODUCTION_KANBAN_FILTER_OPTIONS } from '../utils/productionKanbanFilters';

export default function ProductionKanbanFilters({
  filterMode,
  filterSummary,
  onFilterModeChange,
  onReset,
  onReturnToSearchSource,
  onSearchQueryChange,
  searchQuery,
  searchContext,
}) {
  return (
    <section className="border-y border-slate-200 bg-white px-4 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-extrabold text-slate-900">제작 작업 찾기</h3>
          <p className="mt-1 text-xs text-slate-500">
            저장된 Cloud 작업 기록 안에서만 찾습니다. YouTube API를 새로 호출하지 않습니다.
          </p>
        </div>
        <p className="shrink-0 text-xs font-bold text-slate-500" aria-live="polite">
          {filterSummary.metricText}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_180px_auto]">
        <label className="relative block">
          <span className="sr-only">제작 영상 제목, 채널, 메모 검색</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="영상 제목, 채널, 내 제목, 메모 검색"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <label>
          <span className="sr-only">제작 진행 단계 선택</span>
          <select
            value={filterMode}
            onChange={(event) => onFilterModeChange(event.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            title="표시할 제작 진행 단계를 선택합니다. 저장 상태는 바뀌지 않습니다."
          >
            {PRODUCTION_KANBAN_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onReset}
          disabled={!filterSummary.hasActiveFilters}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
          title="검색어와 보기 조건만 초기화합니다. Cloud 데이터는 변경하지 않습니다."
        >
          <RotateCcw className="h-4 w-4" />
          초기화
        </button>
      </div>

      {searchContext ? (
        <div className="mt-3 flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-amber-800">{searchContext.label}</p>
            <p className="mt-0.5 break-words text-xs leading-relaxed text-amber-700">{searchContext.description}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {typeof onReturnToSearchSource === 'function' ? (
              <button
                type="button"
                onClick={onReturnToSearchSource}
                className="inline-flex h-8 items-center justify-center rounded-lg border border-amber-300 bg-amber-100 px-3 text-xs font-extrabold text-amber-900 hover:bg-amber-200"
                title={searchContext.returnTitle}
              >
                {searchContext.returnLabel}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-8 items-center justify-center rounded-lg border border-amber-300 bg-white px-3 text-xs font-extrabold text-amber-800 hover:bg-amber-100"
              title={searchContext.resetTitle}
            >
              {searchContext.resetLabel}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
