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
  const statusFilterProps = {
    setStatusFilter,
    statusFilter,
    statusFilterOptions,
  };

  const rightsFilterProps = {
    rightsFilter,
    rightsFilterOptions,
    setRightsFilter,
  };

  const searchBoxProps = {
    searchQuery,
    setSearchQuery,
  };

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
      <DiscoveryStatusFilterGroup {...statusFilterProps} />
      <DiscoveryRightsFilterGroup {...rightsFilterProps} />
      <DiscoveryLinkSearchBox {...searchBoxProps} />

      {hasActiveFilters ? (
        <DiscoveryLinksActiveFilterSummary filteredLinkCount={filteredLinkCount} />
      ) : null}
    </div>
  );
}
