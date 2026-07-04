export default function DiscoveryLinksActiveFilterSummary({ filteredLinkCount }) {
  return (
    <p className="mt-2 text-[11px] font-semibold text-slate-500">
      현재 조건에 맞는 링크 {filteredLinkCount}개를 보고 있습니다.
    </p>
  );
}
