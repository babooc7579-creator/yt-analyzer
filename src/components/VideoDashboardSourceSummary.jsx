import ReferenceVaultSummary from './ReferenceVaultSummary';
import StoredVideoGuide from './StoredVideoGuide';

export default function VideoDashboardSourceSummary({
  isReferenceVaultView,
  savedChannelCount,
  savedVideoCount,
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
      visibleScrapCount={visibleScrapCount}
      ttoTtoCount={ttoTtoAssetCount}
    />
  );
}
