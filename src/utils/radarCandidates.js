import { hasStrongReaction, isTtoTtoCandidate } from './video';
import { getYouTubeVideoUrl } from './urls';

export const getRadarReasons = (video) => {
  const reasons = [];

  if (isTtoTtoCandidate(video)) reasons.push('오래됐지만 다시 볼 만함');
  if (hasStrongReaction(video)) reasons.push('채널 평균보다 강한 반응');
  if (Number(video.like_ratio || 0) >= 3) reasons.push('참여율 양호');
  if (Number(video.view_count || 0) >= 1000000) reasons.push('검증된 조회수');

  return reasons.length > 0 ? reasons : ['기본 점수 상위'];
};

export const getRadarPriorityLabel = (score) => {
  if (score >= 180) return '최우선';
  if (score >= 120) return '우선 검토';
  return '확인 필요';
};

export const getRadarScore = (video) => {
  const ttoTtoBonus = isTtoTtoCandidate(video) ? 100 : 0;
  const strongBonus = hasStrongReaction(video) ? 60 : 0;
  const savedAgeBonus = Math.min(Number(video.daysOld || 0) / 30, 20);

  return ttoTtoBonus + strongBonus + Number(video.multiplier || 0) * 10 + Number(video.like_ratio || 0) + savedAgeBonus;
};

export const getRadarCandidateCardViewProps = ({
  index,
  isSaved,
  video,
  onMarkVideoStatus,
  onPromoteToProduction,
  onToggleScrap,
}) => {
  const videoTitle = video.title || '제목 없는 영상';
  const isTtoTto = isTtoTtoCandidate(video);
  const isStrong = hasStrongReaction(video);
  const radarScore = Math.round(getRadarScore(video));
  const priorityLabel = getRadarPriorityLabel(radarScore);
  const reasons = getRadarReasons(video);
  const videoUrl = getYouTubeVideoUrl(video.videoId);

  return {
    badgesProps: {
      isStrong,
      isTtoTto,
    },
    decisionActionsProps: {
      isSaved,
      onMarkVideoStatus,
      onPromoteToProduction,
      onToggleScrap,
      video,
      videoTitle,
    },
    metricsProps: {
      video,
    },
    primaryActionsProps: {
      videoTitle,
      videoUrl,
    },
    scorePanelProps: {
      radarScore,
      reasons,
    },
    thumbnailProps: {
      index,
      priorityLabel,
      video,
      videoTitle,
    },
    titleLinkProps: {
      videoTitle,
      videoUrl,
    },
  };
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
