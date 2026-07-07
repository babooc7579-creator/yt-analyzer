import { getDiscoveryLinksFiltersChildProps } from '../utils/discoveryLinksWorkspaceProps';
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
  const {
    activeFilterSummaryProps,
    rightsFilterProps,
    searchBoxProps,
    statusFilterProps,
  } = getDiscoveryLinksFiltersChildProps({
    filteredLinkCount,
    rightsFilter,
    rightsFilterOptions,
    searchQuery,
    setRightsFilter,
    setSearchQuery,
    setStatusFilter,
    statusFilter,
    statusFilterOptions,
  });

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
      <DiscoveryStatusFilterGroup {...statusFilterProps} />
      <DiscoveryRightsFilterGroup {...rightsFilterProps} />
      <DiscoveryLinkSearchBox {...searchBoxProps} />

      {hasActiveFilters ? (
        <DiscoveryLinksActiveFilterSummary {...activeFilterSummaryProps} />
      ) : null}
    </div>
  );
}
