import HomeSummaryCard from './HomeSummaryCard';
import { getHomeRadarStatsGridViewProps } from '../utils/creatorHomeViewProps';

export default function HomeRadarStatsGrid({
  latestScanText,
  loadedVideoCount,
  savedChannelCount,
  savedVideoCount,
  ttoTtoAssetCount,
}) {
  const viewProps = getHomeRadarStatsGridViewProps({
    latestScanText,
    loadedVideoCount,
    savedChannelCount,
    savedVideoCount,
    ttoTtoAssetCount,
  });

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
      {viewProps.cards.map(card => (
        <HomeSummaryCard key={card.label} {...card} />
      ))}
    </div>
  );
}
