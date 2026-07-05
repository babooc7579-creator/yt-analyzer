import { hasStrongReaction, isTtoTtoCandidate } from './video';

export const getRadarScore = (video) => {
  const ttoTtoBonus = isTtoTtoCandidate(video) ? 100 : 0;
  const strongBonus = hasStrongReaction(video) ? 60 : 0;
  const savedAgeBonus = Math.min(Number(video.daysOld || 0) / 30, 20);

  return ttoTtoBonus + strongBonus + Number(video.multiplier || 0) * 10 + Number(video.like_ratio || 0) + savedAgeBonus;
};

export const getRadarCandidateStripViewProps = ({
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
}) => ({
  completedStateProps: {
    decisionGroups,
    decisionSummary,
    loadedDecisionCount,
    onClearDecisions,
    onOpenVault,
    onRestoreVideo,
  },
  decisionPanelProps: {
    decisionGroups,
    decisionSummary,
    loadedDecisionCount,
    onRestoreVideo,
  },
  gridProps: {
    candidates,
    isVideoSaved,
    onMarkVideoStatus,
    onPromoteToProduction,
    onToggleScrap,
  },
  headerProps: {
    allDecisionCount,
    onClearDecisions,
    onOpenScrapbook,
    savedVideoCount: savedVideos.length,
  },
  isCompleted: candidates.length === 0,
  isEmpty: videos.length === 0,
});
