import { X } from 'lucide-react';

export default function DiscoveryLinksFilteredEmptyState({
  allLinkCount,
  clearFilters,
}) {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="text-sm font-extrabold text-slate-700">조건에 맞는 링크가 없습니다.</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        Cloud에는 링크 {allLinkCount}개가 저장되어 있지만, 현재 검색어나 필터 조건 때문에 보이지 않습니다.
      </p>
      <button
        className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100"
        onClick={clearFilters}
        title="검색어와 필터를 모두 초기화"
        aria-label="발견함 필터 초기화"
        type="button"
      >
        <X className="h-4 w-4" />
        필터 초기화
      </button>
    </div>
  );
}
