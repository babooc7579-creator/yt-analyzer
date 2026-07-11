import HomeSummaryCard from './HomeSummaryCard';
import { getHomeRadarStatsGridViewProps } from '../utils/creatorHomeViewProps';

export default function HomeRadarStatsGrid({
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  latestScanText,
  loadedVideoCount,
  productionCandidateCount,
  savedChannelCount,
  savedVideoCount,
  ttoTtoAssetCount,
}) {
  const viewProps = getHomeRadarStatsGridViewProps({
    discoveryCandidateCount,
    discoveryRightsWarningCount,
    latestScanText,
    loadedVideoCount,
    productionCandidateCount,
    savedChannelCount,
    savedVideoCount,
    ttoTtoAssetCount,
  });

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-7">
      {viewProps.cards.map(card => (
        <HomeSummaryCard key={card.label} {...card} />
      ))}
    </div>
  );
}
