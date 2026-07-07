import {
  PRODUCTION_STATUS,
  PRODUCTION_STATUS_LABELS,
  VIDEO_STATUS,
  VIDEO_STATUS_LABELS,
  hasAnyVideoReviewStatus,
  hasProductionStatus,
  hasVideoReviewStatus,
  isRadarHiddenRecord,
} from '../constants/status';
import { hasStrongReaction, isTtoTtoCandidate } from './video';
import { getYouTubeVideoUrl } from './urls';

export const RADAR_TODAY_CANDIDATE_LIMIT = 6;
export const RADAR_PRIORITY_SCORE_THRESHOLD = 120;

const toArray = (items) => (Array.isArray(items) ? items : []);

const toRadarVideoList = (videos) => (
  toArray(videos).filter(video => video && typeof video === 'object')
);

const toRecordMap = (records) => (
  records && typeof records === 'object' ? records : {}
);

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

export const getRadarDecisionBuckets = ({
  userRecordMap,
  videoList,
} = {}) => (
  toRadarVideoList(videoList).reduce((buckets, video) => {
    const record = toRecordMap(userRecordMap)[video.videoId];
    if (hasVideoReviewStatus(record, VIDEO_STATUS.REVIEWED)) buckets.reviewed.push(video);
    if (hasAnyVideoReviewStatus(record, [VIDEO_STATUS.LEGACY_LATER, VIDEO_STATUS.WATCH_LATER])) buckets.later.push(video);
    if (hasVideoReviewStatus(record, VIDEO_STATUS.EXCLUDED)) buckets.excluded.push(video);
    if (hasProductionStatus(record, PRODUCTION_STATUS.CANDIDATE)) buckets.production.push(video);
    return buckets;
  }, { reviewed: [], later: [], excluded: [], production: [] })
);

export const getRadarDecisionSummary = (decisionBuckets = {}) => ({
  excluded: toArray(decisionBuckets.excluded).length,
  later: toArray(decisionBuckets.later).length,
  production: toArray(decisionBuckets.production).length,
  reviewed: toArray(decisionBuckets.reviewed).length,
});

export const getRadarLoadedDecisionCount = (decisionSummary = {}) => (
  toNumber(decisionSummary.reviewed)
  + toNumber(decisionSummary.later)
  + toNumber(decisionSummary.excluded)
  + toNumber(decisionSummary.production)
);

export const getRadarHiddenDecisionCount = (userRecordMap = {}) => (
  Object.values(toRecordMap(userRecordMap)).filter(isRadarHiddenRecord).length
);

export const getRadarCandidatePool = ({
  userRecordMap,
  videoList,
} = {}) => (
  [...toRadarVideoList(videoList)]
    .filter((video) => {
      const record = toRecordMap(userRecordMap)[video.videoId];
      return !isRadarHiddenRecord(record);
    })
    .sort((a, b) => getRadarScore(b) - getRadarScore(a))
);

export const getRadarTodayCandidates = (candidatePool = []) => (
  toArray(candidatePool).slice(0, RADAR_TODAY_CANDIDATE_LIMIT)
);

export const getRadarQueueSummary = ({
  allDecisionCount = 0,
  candidatePool = [],
  candidates = [],
} = {}) => ({
  candidateLimit: RADAR_TODAY_CANDIDATE_LIMIT,
  hiddenDecisionCount: allDecisionCount,
  highPriorityCount: toArray(candidatePool).filter((video) => (
    getRadarScore(video) >= RADAR_PRIORITY_SCORE_THRESHOLD
  )).length,
  shownCandidateCount: toArray(candidates).length,
  visibleQueueCount: toArray(candidatePool).length,
});

export const getRadarDecisionGroups = (decisionBuckets = {}) => [
  { key: 'reviewed', label: VIDEO_STATUS_LABELS[VIDEO_STATUS.REVIEWED], videos: toArray(decisionBuckets.reviewed) },
  { key: 'later', label: VIDEO_STATUS_LABELS[VIDEO_STATUS.WATCH_LATER], videos: toArray(decisionBuckets.later) },
  { key: 'production', label: PRODUCTION_STATUS_LABELS[PRODUCTION_STATUS.CANDIDATE], videos: toArray(decisionBuckets.production) },
  { key: 'excluded', label: VIDEO_STATUS_LABELS[VIDEO_STATUS.EXCLUDED], videos: toArray(decisionBuckets.excluded) },
];

export const getRadarCandidateDataModel = ({
  videoUserRecords,
  videos,
} = {}) => {
  const videoList = toRadarVideoList(videos);
  const userRecordMap = toRecordMap(videoUserRecords);
  const decisionBuckets = getRadarDecisionBuckets({ userRecordMap, videoList });
  const decisionSummary = getRadarDecisionSummary(decisionBuckets);
  const loadedDecisionCount = getRadarLoadedDecisionCount(decisionSummary);
  const allDecisionCount = getRadarHiddenDecisionCount(userRecordMap);
  const candidatePool = getRadarCandidatePool({ userRecordMap, videoList });
  const candidates = getRadarTodayCandidates(candidatePool);
  const queueSummary = getRadarQueueSummary({
    allDecisionCount,
    candidatePool,
    candidates,
  });

  return {
    allDecisionCount,
    candidates,
    decisionGroups: getRadarDecisionGroups(decisionBuckets),
    decisionSummary,
    loadedDecisionCount,
    queueSummary,
  };
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
