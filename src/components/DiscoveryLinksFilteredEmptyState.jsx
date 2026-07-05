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
        필터 초기화는 화면 조건만 바꾸며 저장 데이터나 외부 사이트에는 영향을 주지 않습니다.
      </p>
      <button
        className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100"
        onClick={clearFilters}
        title="검색어와 필터를 모두 초기화합니다. Cloud 저장 데이터는 바꾸지 않습니다."
        aria-label="발견함 화면 필터 초기화, 저장 데이터 변경 없음"
        type="button"
      >
        <X className="h-4 w-4" />
        필터 초기화
      </button>
    </div>
  );
}
