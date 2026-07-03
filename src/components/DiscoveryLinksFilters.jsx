import React from 'react';
import { Search, X } from 'lucide-react';
import { DISCOVERY_RIGHTS_TONES } from '../constants/discoveryLinks';

export default function DiscoveryLinksFilters({
  filteredLinkCount,
  hasActiveFilters,
  rightsFilter,
  rightsFilterOptions,
  searchQuery,
  setRightsFilter,
  setSearchQuery,
  setStatusFilter,
  statusFilter,
  statusFilterOptions,
}) {
  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
        검토 상태별 보기
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {statusFilterOptions.map((option) => {
          const isActive = statusFilter === option.value;
          return (
            <button
              className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-extrabold transition ${
                isActive
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              title={`${option.label} 상태 링크만 보기`}
              aria-label={`${option.label} 상태 링크 ${option.count}개 보기`}
              type="button"
            >
              <span>{option.label}</span>
              <span className={isActive ? 'text-indigo-500' : 'text-slate-400'}>
                {option.count}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
        권리 확인 상태별 보기
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {rightsFilterOptions.map((option) => {
          const isActive = rightsFilter === option.value;
          const rightsTone = DISCOVERY_RIGHTS_TONES[option.value];
          const buttonTone = rightsTone
            ? `${rightsTone.badge} ${isActive ? 'shadow-sm ring-2 ring-white' : 'opacity-75 hover:opacity-100'}`
            : isActive
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100';
          return (
            <button
              className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-extrabold transition ${buttonTone}`}
              key={option.value}
              onClick={() => setRightsFilter(option.value)}
              title={`${option.label} 권리 상태 링크만 보기`}
              aria-label={`${option.label} 권리 상태 링크 ${option.count}개 보기`}
              type="button"
            >
              <span>{option.label}</span>
              <span className={isActive || rightsTone ? 'text-current opacity-75' : 'text-slate-400'}>
                {option.count}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-3">
        <label className="sr-only" htmlFor="discovery-link-search">
          발견 링크 검색
        </label>
        <div className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-500 transition focus-within:border-indigo-400 focus-within:bg-white">
          <Search className="h-4 w-4 shrink-0" />
          <input
            className="min-w-0 flex-1 bg-transparent py-2 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            id="discovery-link-search"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="제목, 메모, URL 검색"
            type="search"
            value={searchQuery}
            aria-label="발견 링크 검색어"
          />
          {searchQuery ? (
            <button
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
              onClick={() => setSearchQuery('')}
              type="button"
              aria-label="검색어 지우기"
              title="검색어 지우기"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {hasActiveFilters ? (
        <p className="mt-2 text-[11px] font-semibold text-slate-500">
          현재 조건에 맞는 링크 {filteredLinkCount}개를 보고 있습니다.
        </p>
      ) : null}
    </div>
  );
}
