import ReferenceVaultSummary from './ReferenceVaultSummary';
import StoredVideoGuide from './StoredVideoGuide';

export default function VideoDashboardSourceSummary({
  isReferenceVaultView,
  onChangeSelectedChannels,
  selectedChannelCount,
  selectedChannelScopes,
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
      onChangeSelectedChannels={onChangeSelectedChannels}
      selectedChannelCount={selectedChannelCount}
      selectedChannelScopes={selectedChannelScopes}
      selectedChannelTitles={selectedChannelTitles}
      visibleScrapCount={visibleScrapCount}
      ttoTtoCount={ttoTtoAssetCount}
    />
  );
}
