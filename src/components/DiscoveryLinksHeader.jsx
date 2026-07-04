import DiscoveryLinksHeaderActions from './DiscoveryLinksHeaderActions';
import DiscoveryLinksHeaderTitle from './DiscoveryLinksHeaderTitle';

export default function DiscoveryLinksHeader({
  filteredLinkCount,
  loading,
  onRefresh,
  saving,
  totalLinkCount,
  urlList,
}) {
  const headerActionsProps = {
    filteredLinkCount,
    loading,
    onRefresh,
    saving,
    urlList,
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <DiscoveryLinksHeaderTitle totalLinkCount={totalLinkCount} />

      <DiscoveryLinksHeaderActions {...headerActionsProps} />
    </div>
  );
}
