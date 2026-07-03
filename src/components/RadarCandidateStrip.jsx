import { useRadarCandidateData } from '../hooks/useRadarCandidateData';
import RadarCandidateCompletedState from './RadarCandidateCompletedState';
import RadarCandidateEmptyState from './RadarCandidateEmptyState';
import RadarCandidateGrid from './RadarCandidateGrid';
import RadarCandidateStripHeader from './RadarCandidateStripHeader';
import RadarDecisionPanel from './RadarDecisionPanel';

export default function RadarCandidateStrip({
  videos,
  savedVideos,
  videoUserRecords,
  isVideoSaved,
  onToggleScrap,
  onMarkVideoStatus,
  onPromoteToProduction,
  onRestoreVideo,
  onClearDecisions,
  onOpenVault,
  onOpenScrapbook,
}) {
  const {
    allDecisionCount,
    candidates,
    decisionGroups,
    decisionSummary,
    loadedDecisionCount,
  } = useRadarCandidateData({
    videoUserRecords,
    videos,
  });

  if (videos.length === 0) {
    return <RadarCandidateEmptyState onOpenVault={onOpenVault} />;
  }

  if (candidates.length === 0) {
    return (
      <RadarCandidateCompletedState
        decisionGroups={decisionGroups}
        decisionSummary={decisionSummary}
        loadedDecisionCount={loadedDecisionCount}
        onClearDecisions={onClearDecisions}
        onOpenVault={onOpenVault}
        onRestoreVideo={onRestoreVideo}
      />
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
      <RadarCandidateStripHeader
        allDecisionCount={allDecisionCount}
        onClearDecisions={onClearDecisions}
        onOpenScrapbook={onOpenScrapbook}
        savedVideoCount={savedVideos.length}
      />

      <RadarDecisionPanel
        decisionGroups={decisionGroups}
        decisionSummary={decisionSummary}
        loadedDecisionCount={loadedDecisionCount}
        onRestoreVideo={onRestoreVideo}
      />

      <RadarCandidateGrid
        candidates={candidates}
        isVideoSaved={isVideoSaved}
        onMarkVideoStatus={onMarkVideoStatus}
        onPromoteToProduction={onPromoteToProduction}
        onToggleScrap={onToggleScrap}
      />
    </div>
  );
}
