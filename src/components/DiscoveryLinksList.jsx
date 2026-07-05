import DiscoveryLinksEmptyState from './DiscoveryLinksEmptyState';
import DiscoveryLinksFilteredEmptyState from './DiscoveryLinksFilteredEmptyState';
import DiscoveryLinksGrid from './DiscoveryLinksGrid';
import DiscoveryLinksLoadingState from './DiscoveryLinksLoadingState';

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function DiscoveryLinksList({
  allLinkCount,
  clearFilters,
  filteredLinks,
  loading,
  onDeleteLink,
  onUpdateLink,
  saving,
}) {
  const linkList = toArray(filteredLinks);

  if (loading) {
    return <DiscoveryLinksLoadingState />;
  }

  if (allLinkCount === 0) {
    return <DiscoveryLinksEmptyState />;
  }

  if (linkList.length === 0) {
    const filteredEmptyStateProps = {
      allLinkCount,
      clearFilters,
    };

    return (
      <DiscoveryLinksFilteredEmptyState {...filteredEmptyStateProps} />
    );
  }

  const gridProps = {
    filteredLinks: linkList,
    onDeleteLink,
    onUpdateLink,
    saving,
  };

  return (
    <DiscoveryLinksGrid {...gridProps} />
  );
}
