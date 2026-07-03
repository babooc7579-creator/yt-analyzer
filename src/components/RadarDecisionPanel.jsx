import RadarDecisionLists from './RadarDecisionLists';
import RadarDecisionSummary from './RadarDecisionSummary';

export default function RadarDecisionPanel({
  decisionGroups,
  decisionSummary,
  loadedDecisionCount,
  onRestoreVideo,
}) {
  return (
    <>
      <RadarDecisionSummary summary={decisionSummary} />
      <RadarDecisionLists
        groups={decisionGroups}
        loadedDecisionCount={loadedDecisionCount}
        onRestoreVideo={onRestoreVideo}
      />
    </>
  );
}
