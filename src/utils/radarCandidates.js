import { hasStrongReaction, isTtoTtoCandidate } from './video';
import { getYouTubeVideoUrl } from './urls';

export const RADAR_TODAY_CANDIDATE_LIMIT = 6;
export const RADAR_PRIORITY_SCORE_THRESHOLD = 120;

const toArray = (items) => (Array.isArray(items) ? items : []);

const toVideoObject = (video) => (
  video && typeof video === 'object' ? video : {}
);

const toNumber = (value) => {
  const numericValue = Number(value || 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

export const getRadarReasons = (video) => {
  const sourceVideo = toVideoObject(video);
  const reasons = [];

  if (isTtoTtoCandidate(sourceVideo)) reasons.push('오래됐지만 다시 볼 만함');
  if (hasStrongReaction(sourceVideo)) reasons.push('채널 평균보다 강한 반응');
  if (toNumber(sourceVideo.like_ratio) >= 3) reasons.push('참여율 양호');
  if (toNumber(sourceVideo.view_count) >= 1000000) reasons.push('검증된 조회수');

  return reasons.length > 0 ? reasons : ['기본 점수 상위'];
};

export const getRadarPriorityLabel = (score) => {
  if (score >= 180) return '최우선';
  if (score >= 120) return '우선 검토';
  return '확인 필요';
};

export const getRadarScore = (video) => {
  const sourceVideo = toVideoObject(video);
  const ttoTtoBonus = isTtoTtoCandidate(sourceVideo) ? 100 : 0;
  const strongBonus = hasStrongReaction(sourceVideo) ? 60 : 0;
  const savedAgeBonus = Math.min(toNumber(sourceVideo.daysOld) / 30, 20);

  return ttoTtoBonus + strongBonus + toNumber(sourceVideo.multiplier) * 10 + toNumber(sourceVideo.like_ratio) + savedAgeBonus;
};

export const getRadarCandidateCardViewProps = ({
  index,
  isSaved,
  video,
  onMarkVideoStatus,
  onPromoteToProduction,
  onToggleScrap,
}) => {
  const sourceVideo = toVideoObject(video);
  const videoTitle = sourceVideo.title || '제목 없는 영상';
  const isTtoTto = isTtoTtoCandidate(sourceVideo);
  const isStrong = hasStrongReaction(sourceVideo);
  const radarScore = Math.round(getRadarScore(sourceVideo));
  const priorityLabel = getRadarPriorityLabel(radarScore);
  const reasons = getRadarReasons(sourceVideo);
  const videoUrl = getYouTubeVideoUrl(sourceVideo.videoId);

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
      video: sourceVideo,
      videoTitle,
    },
    metricsProps: {
      video: sourceVideo,
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
      video: sourceVideo,
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
  queueSummary,
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
    candidates: toArray(candidates),
    isVideoSaved,
    onMarkVideoStatus,
    onPromoteToProduction,
    onToggleScrap,
  },
  headerProps: {
    allDecisionCount,
    onClearDecisions,
    onOpenScrapbook,
    queueSummary,
    savedVideoCount: toArray(savedVideos).length,
  },
  isCompleted: toArray(candidates).length === 0,
  isEmpty: toArray(videos).length === 0,
});
