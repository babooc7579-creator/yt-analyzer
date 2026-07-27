import HomeSummaryCard from './HomeSummaryCard';
import { getHomeRadarStatsGridViewProps } from '../utils/creatorHomeViewProps';

export default function HomeRadarStatsGrid({
  channelsLoading,
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  latestScanText,
  loadedVideoCount,
  productionCandidateCount,
  productionFocusCount,
  savedChannelCount,
  savedVideoCount,
  ttoTtoAssetCount,
}) {
  const viewProps = getHomeRadarStatsGridViewProps({
    channelsLoading,
    discoveryCandidateCount,
    discoveryRightsWarningCount,
    latestScanText,
    loadedVideoCount,
    productionCandidateCount,
    productionFocusCount,
    savedChannelCount,
    savedVideoCount,
    ttoTtoAssetCount,
  });

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {viewProps.cards.map(card => (
        <HomeSummaryCard key={card.label} {...card} />
      ))}
    </div>
  );
}
