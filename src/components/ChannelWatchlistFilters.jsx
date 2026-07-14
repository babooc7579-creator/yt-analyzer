import { RotateCcw, Search } from 'lucide-react';

import {
  CHANNEL_WATCH_GRADE_OPTIONS,
  CHANNEL_WATCH_SCAN_OPTIONS,
  CHANNEL_WATCH_SELECTION_OPTIONS,
} from '../utils/channelWatchlist';

export default function ChannelWatchlistFilters({
  gradeFilter,
  hasActiveFilters,
  onChangeGradeFilter,
  onChangeScanFilter,
  onChangeSearchQuery,
  onChangeSelectionFilter,
  onChangeTagFilter,
  onResetFilters,
  scanFilter,
  searchQuery,
  selectionFilter,
  tagFilter,
  tagOptions,
}) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      <label className="relative min-w-0">
        <span className="sr-only">채널 이름 또는 태그 검색</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onChangeSearchQuery(event.target.value)}
          placeholder="채널 이름 또는 태그 검색"
          className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
        />
      </label>

      <select
        value={tagFilter}
        onChange={(event) => onChangeTagFilter(event.target.value)}
        aria-label="채널 분류 필터"
        className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-bold text-slate-200 outline-none focus:border-cyan-400"
      >
        <option value="all">분류 전체</option>
        {tagOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      <select
        value={gradeFilter}
        onChange={(event) => onChangeGradeFilter(event.target.value)}
        aria-label="채널 등급 필터"
        className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-bold text-slate-200 outline-none focus:border-cyan-400"
      >
        {CHANNEL_WATCH_GRADE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      <select
        value={scanFilter}
        onChange={(event) => onChangeScanFilter(event.target.value)}
        aria-label="마지막 수집일 필터"
        className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-bold text-slate-200 outline-none focus:border-cyan-400"
      >
        {CHANNEL_WATCH_SCAN_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      <select
        value={selectionFilter}
        onChange={(event) => onChangeSelectionFilter(event.target.value)}
        aria-label="채널 선택 상태 필터"
        className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-bold text-slate-200 outline-none focus:border-cyan-400"
      >
        {CHANNEL_WATCH_SELECTION_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      <button
        type="button"
        onClick={onResetFilters}
        disabled={!hasActiveFilters}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs font-extrabold text-slate-300 hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        title="채널 화면 필터만 초기화합니다. 저장이나 API 호출은 없습니다."
      >
        <RotateCcw className="h-4 w-4" /> 초기화
      </button>
    </div>
  );
}
