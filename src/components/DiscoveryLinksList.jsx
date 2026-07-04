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
  if (loading) {
    return <DiscoveryLinksLoadingState />;
  }

  if (allLinkCount === 0) {
    return <DiscoveryLinksEmptyState />;
  }

  if (filteredLinks.length === 0) {
    const filteredEmptyStateProps = {
      allLinkCount,
      clearFilters,
    };

    return (
      <DiscoveryLinksFilteredEmptyState {...filteredEmptyStateProps} />
    );
  }

  const gridProps = {
    filteredLinks,
    onDeleteLink,
    onUpdateLink,
    saving,
  };

  return (
    <DiscoveryLinksGrid {...gridProps} />
  );
}
