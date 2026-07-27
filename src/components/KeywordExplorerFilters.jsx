import { RotateCcw, Search } from 'lucide-react';

import {
  KEYWORD_AGE_OPTIONS,
  KEYWORD_LENGTH_OPTIONS,
  KEYWORD_SORT_OPTIONS,
  KEYWORD_VIEW_OPTIONS,
} from '../utils/keywordExplorer';

export default function KeywordExplorerFilters({
  ageFilter,
  hasActiveFilters,
  lengthFilter,
  minimumViews,
  onChangeAgeFilter,
  onChangeLengthFilter,
  onChangeMinimumViews,
  onChangeSearchQuery,
  onChangeSortType,
  onReset,
  searchQuery,
  sortType,
}) {
  return (
    <section className="border-y border-slate-800 bg-slate-950/55 px-4 py-4">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        <label className="relative block xl:col-span-2">
          <span className="sr-only">영상 제목 또는 채널 키워드 검색</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onChangeSearchQuery(event.target.value)}
            placeholder="예: cake, 반전, 역사"
            className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
          />
        </label>

        <FilterSelect label="영상 길이" value={lengthFilter} onChange={onChangeLengthFilter} options={KEYWORD_LENGTH_OPTIONS} />
        <FilterSelect label="업로드 시기" value={ageFilter} onChange={onChangeAgeFilter} options={KEYWORD_AGE_OPTIONS} />
        <FilterSelect label="최소 조회수" value={minimumViews} onChange={onChangeMinimumViews} options={KEYWORD_VIEW_OPTIONS} />
        <FilterSelect label="정렬" value={sortType} onChange={onChangeSortType} options={KEYWORD_SORT_OPTIONS} />

        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 text-xs font-extrabold text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-700"
          title="검색어와 화면 필터만 초기화합니다. 온라인 저장소(Azure DB) 데이터는 변경하지 않습니다."
        >
          <RotateCcw className="h-4 w-4" /> 초기화
        </button>
      </div>
    </section>
  );
}

function FilterSelect({ label, onChange, options, value }) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-bold text-slate-200 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
        title={`${label} 화면 필터입니다. 데이터 저장이나 API 호출은 실행하지 않습니다.`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
