import DiscoveryLinksActiveFilterSummary from './DiscoveryLinksActiveFilterSummary';
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
        <DiscoveryLinksActiveFilterSummary filteredLinkCount={filteredLinkCount} />
      ) : null}
    </div>
  );
}
