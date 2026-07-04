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
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <DiscoveryLinksHeaderTitle totalLinkCount={totalLinkCount} />

      <DiscoveryLinksHeaderActions
        filteredLinkCount={filteredLinkCount}
        loading={loading}
        onRefresh={onRefresh}
        saving={saving}
        urlList={urlList}
      />
    </div>
  );
}
