import { getDiscoveryLinksListViewProps } from '../utils/discoveryLinksWorkspaceProps';
import DiscoveryLinksEmptyState from './DiscoveryLinksEmptyState';
import DiscoveryLinksFilteredEmptyState from './DiscoveryLinksFilteredEmptyState';
import DiscoveryLinksGrid from './DiscoveryLinksGrid';
import DiscoveryLinksLoadingState from './DiscoveryLinksLoadingState';

export default function DiscoveryLinksList({
  allLinkCount,
  clearFilters,
  filteredLinks,
  loading,
  onDeleteLink,
  onUpdateLink,
  saving,
}) {
  const {
    filteredEmptyStateProps,
    gridProps,
    linkList,
  } = getDiscoveryLinksListViewProps({
    allLinkCount,
    clearFilters,
    filteredLinks,
    onDeleteLink,
    onUpdateLink,
    saving,
  });

  if (loading) {
    return <DiscoveryLinksLoadingState />;
  }

  if (allLinkCount === 0) {
    return <DiscoveryLinksEmptyState />;
  }

  if (linkList.length === 0) {
    return (
      <DiscoveryLinksFilteredEmptyState {...filteredEmptyStateProps} />
    );
  }

  return (
    <DiscoveryLinksGrid {...gridProps} />
  );
}
