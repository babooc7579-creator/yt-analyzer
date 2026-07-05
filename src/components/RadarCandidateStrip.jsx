import { useRadarCandidateData } from '../hooks/useRadarCandidateData';
import { getRadarCandidateStripViewProps } from '../utils/radarCandidates';
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
  const {
    completedStateProps,
    decisionPanelProps,
    gridProps,
    headerProps,
    isCompleted,
    isEmpty,
  } = getRadarCandidateStripViewProps({
    allDecisionCount,
    candidates,
    decisionGroups,
    decisionSummary,
    isVideoSaved,
    loadedDecisionCount,
    onClearDecisions,
    onMarkVideoStatus,
    onOpenScrapbook,
    onOpenVault,
    onPromoteToProduction,
    onRestoreVideo,
    onToggleScrap,
    savedVideos,
    videos,
  });

  if (isEmpty) {
    return <RadarCandidateEmptyState onOpenVault={onOpenVault} />;
  }

  if (isCompleted) {
    return (
      <RadarCandidateCompletedState {...completedStateProps} />
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
      <RadarCandidateStripHeader {...headerProps} />

      <RadarDecisionPanel {...decisionPanelProps} />

      <RadarCandidateGrid {...gridProps} />
    </div>
  );
}
