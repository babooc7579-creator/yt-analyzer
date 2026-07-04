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
    return (
      <DiscoveryLinksFilteredEmptyState
        allLinkCount={allLinkCount}
        clearFilters={clearFilters}
      />
    );
  }

  return (
    <DiscoveryLinksGrid
      filteredLinks={filteredLinks}
      onDeleteLink={onDeleteLink}
      onUpdateLink={onUpdateLink}
      saving={saving}
    />
  );
}
