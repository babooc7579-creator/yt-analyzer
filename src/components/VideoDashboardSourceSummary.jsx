import ReferenceVaultSummary from './ReferenceVaultSummary';
import StoredVideoGuide from './StoredVideoGuide';

export default function VideoDashboardSourceSummary({
  isReferenceVaultView,
  savedChannelCount,
  savedVideoCount,
  selectedChannelCount,
  selectedChannelTitles,
  totalVideoCount,
  ttoTtoAssetCount,
  visibleScrapCount,
}) {
  if (!isReferenceVaultView) {
    return <StoredVideoGuide />;
  }

  return (
    <ReferenceVaultSummary
      videoCount={totalVideoCount}
      channelCount={savedChannelCount}
      scrapCount={savedVideoCount}
      selectedChannelCount={selectedChannelCount}
      selectedChannelTitles={selectedChannelTitles}
      visibleScrapCount={visibleScrapCount}
      ttoTtoCount={ttoTtoAssetCount}
    />
  );
}
