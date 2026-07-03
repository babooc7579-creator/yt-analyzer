import DiscoveryLinkSearchBox from './DiscoveryLinkSearchBox';
import DiscoveryRightsFilterGroup from './DiscoveryRightsFilterGroup';
import DiscoveryStatusFilterGroup from './DiscoveryStatusFilterGroup';

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
      <DiscoveryStatusFilterGroup
        setStatusFilter={setStatusFilter}
        statusFilter={statusFilter}
        statusFilterOptions={statusFilterOptions}
      />
      <DiscoveryRightsFilterGroup
        rightsFilter={rightsFilter}
        rightsFilterOptions={rightsFilterOptions}
        setRightsFilter={setRightsFilter}
      />
      <DiscoveryLinkSearchBox
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {hasActiveFilters ? (
        <p className="mt-2 text-[11px] font-semibold text-slate-500">
          현재 조건에 맞는 링크 {filteredLinkCount}개를 보고 있습니다.
        </p>
      ) : null}
    </div>
  );
}
