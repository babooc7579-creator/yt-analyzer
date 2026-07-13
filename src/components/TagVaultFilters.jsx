import { CheckSquare, RotateCcw, Search } from 'lucide-react';

import { TAG_VAULT_LENGTH_OPTIONS, TAG_VAULT_SORT_OPTIONS } from '../utils/tagVault';

export default function TagVaultFilters({
  facets,
  hasActiveFilters,
  lengthFilter,
  onChangeLengthFilter,
  onChangeSearchQuery,
  onChangeSelectedTag,
  onChangeSortType,
  onReset,
  onSelectTagChannels,
  searchQuery,
  selectedFacet,
  selectedTag,
  sortType,
}) {
  return (
    <section className="border-y border-slate-800 bg-slate-950/55 px-4 py-4">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-[200px_minmax(240px,1fr)_150px_160px_auto_auto]">
        <label>
          <span className="sr-only">채널 태그</span>
          <select value={selectedTag} onChange={(event) => onChangeSelectedTag(event.target.value)} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-bold text-slate-200 outline-none focus:border-emerald-400">
            {facets.map((facet) => <option key={facet.label} value={facet.label}>{facet.label} ({facet.channelCount})</option>)}
          </select>
        </label>

        <label className="relative block">
          <span className="sr-only">태그 안에서 영상 검색</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="search" value={searchQuery} onChange={(event) => onChangeSearchQuery(event.target.value)} placeholder="태그 안에서 제목·채널 검색" className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400" />
        </label>

        <FilterSelect label="영상 길이" options={TAG_VAULT_LENGTH_OPTIONS} value={lengthFilter} onChange={onChangeLengthFilter} />
        <FilterSelect label="정렬" options={TAG_VAULT_SORT_OPTIONS} value={sortType} onChange={onChangeSortType} />

        <button type="button" onClick={() => onSelectTagChannels(selectedFacet?.channelIds || [])} disabled={!selectedFacet} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-500/50 px-3 text-xs font-extrabold text-emerald-200 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-600" title="이 태그의 채널만 선택합니다. 영상 수집이나 DB 조회는 실행하지 않습니다.">
          <CheckSquare className="h-4 w-4" /> 태그 채널 선택
        </button>
        <button type="button" onClick={onReset} disabled={!hasActiveFilters} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 text-xs font-extrabold text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-700">
          <RotateCcw className="h-4 w-4" /> 필터 초기화
        </button>
      </div>
    </section>
  );
}

function FilterSelect({ label, onChange, options, value }) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-bold text-slate-200 outline-none focus:border-emerald-400">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
