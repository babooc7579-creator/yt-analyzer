import { RotateCcw, Search } from 'lucide-react';

import {
  TTOTTO_AGE_OPTIONS,
  TTOTTO_LENGTH_OPTIONS,
  TTOTTO_SORT_OPTIONS,
  TTOTTO_VIEW_OPTIONS,
} from '../utils/ttoTtoExplorer';

export default function TtoTtoExplorerFilters({
  ageFilter,
  hasActiveFilters,
  lengthFilter,
  minimumViews,
  onChangeLengthFilter,
  onChangeMinimumViews,
  onChangeSearchQuery,
  onChangeSortType,
  onChangeAgeFilter,
  onResetFilters,
  searchQuery,
  sortType,
}) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_150px_150px_150px_160px_auto]">
      <label className="relative min-w-0">
        <span className="sr-only">제목 또는 채널 검색</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onChangeSearchQuery(event.target.value)}
          placeholder="제목 또는 채널 검색"
          className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-rose-400"
        />
      </label>

      <label>
        <span className="sr-only">후보 게시 시기</span>
        <select
          value={ageFilter}
          onChange={(event) => onChangeAgeFilter(event.target.value)}
          className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-bold text-slate-200 outline-none focus:border-rose-400"
          title="현재 또터또 후보를 게시 시기로 좁힙니다. 저장이나 API 호출은 없습니다."
        >
          {TTOTTO_AGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label>
        <span className="sr-only">영상 길이</span>
        <select
          value={lengthFilter}
          onChange={(event) => onChangeLengthFilter(event.target.value)}
          className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-bold text-slate-200 outline-none focus:border-rose-400"
        >
          {TTOTTO_LENGTH_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label>
        <span className="sr-only">최소 조회수</span>
        <select
          value={minimumViews}
          onChange={(event) => onChangeMinimumViews(Number(event.target.value))}
          className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-bold text-slate-200 outline-none focus:border-rose-400"
        >
          {TTOTTO_VIEW_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label>
        <span className="sr-only">정렬 기준</span>
        <select
          value={sortType}
          onChange={(event) => onChangeSortType(event.target.value)}
          className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-bold text-slate-200 outline-none focus:border-rose-400"
        >
          {TTOTTO_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={onResetFilters}
        disabled={!hasActiveFilters}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs font-extrabold text-slate-300 hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        title="검색어, 후보 게시 시기, 영상 길이, 최소 조회수 필터를 초기화합니다. 저장이나 API 호출은 없습니다."
      >
        <RotateCcw className="h-4 w-4" /> 초기화
      </button>
    </div>
  );
}
