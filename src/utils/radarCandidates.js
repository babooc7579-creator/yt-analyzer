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

const getDisplayVideoTitle = (videoTitle) => videoTitle || '이 영상';

const getVideoTitle = (video) => toVideoObject(video).title || '제목 없는 영상';

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

export const getRadarCandidateBadgesViewProps = ({
  isStrong = false,
  isTtoTto = false,
} = {}) => ({
  badges: [
    isTtoTto && {
      className: 'inline-flex items-center gap-1 rounded-full bg-rose-600 px-2 py-1 text-[10px] font-extrabold text-white',
      iconName: 'ttoTto',
      key: 'ttoTto',
      label: '또터또',
    },
    isStrong && {
      className: 'inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-700',
      iconName: 'strong',
      key: 'strong',
      label: '강한 반응',
    },
  ].filter(Boolean),
});

export const getRadarCandidateMetricsViewProps = (video) => {
  const sourceVideo = toVideoObject(video);

  return {
    items: [
      { label: '대박 지수', value: `${toNumber(sourceVideo.multiplier).toFixed(1)}x` },
      { label: '경과', value: `${toNumber(sourceVideo.daysOld)}일` },
      { label: '참여율', value: `${toNumber(sourceVideo.like_ratio)}%` },
    ],
  };
};

export const getRadarCandidatePrimaryActionsViewProps = ({
  videoTitle,
  videoUrl,
} = {}) => {
  const displayTitle = getDisplayVideoTitle(videoTitle);

  return {
    copyButtonProps: {
      ariaLabel: `${displayTitle} YouTube 원본 URL 복사`,
      copiedLabel: '복사 완료',
      label: 'URL 복사',
      title: 'YouTube 원본 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다.',
    },
    openButtonProps: {
      'aria-label': `${displayTitle} YouTube에서 열기`,
      label: '1. 영상 열고 판단',
      title: 'YouTube에서 원본 영상 열기',
    },
    videoUrl,
  };
};

export const getRadarCandidateScorePanelViewProps = ({
  radarScore = 0,
  reasons,
} = {}) => ({
  reasonList: toArray(reasons),
  scoreText: radarScore,
  titleText: '후보 판단 점수',
});

export const getRadarCandidateThumbnailViewProps = ({
  index = 0,
  priorityLabel = '',
  video,
  videoTitle,
} = {}) => {
  const displayTitle = getDisplayVideoTitle(videoTitle);

  return {
    imageProps: {
      alt: `${displayTitle} 썸네일`,
      src: toVideoObject(video).thumbnail,
    },
    priorityLabel,
    rankText: `#${index + 1}`,
  };
};

export const getRadarCandidateTitleLinkViewProps = ({
  videoTitle,
  videoUrl,
} = {}) => {
  const displayTitle = getDisplayVideoTitle(videoTitle);

  return {
    'aria-label': `${displayTitle} YouTube 원본 영상 열기`,
    title: displayTitle,
    videoTitle: displayTitle,
    videoUrl,
  };
};

export const getRadarDecisionSummaryViewProps = (summary = {}) => ({
  cards: [
    {
      className: 'rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2',
      label: '봤음',
      labelClassName: 'text-[10px] font-extrabold text-emerald-100',
      value: toNumber(summary.reviewed),
    },
    {
      className: 'rounded-xl border border-slate-500/30 bg-slate-900/60 px-3 py-2',
      label: '나중에 보기',
      labelClassName: 'text-[10px] font-extrabold text-slate-200',
      value: toNumber(summary.later),
    },
    {
      className: 'rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-3 py-2',
      label: '제작 후보',
      labelClassName: 'text-[10px] font-extrabold text-indigo-100',
      value: toNumber(summary.production),
    },
    {
      className: 'rounded-xl border border-slate-500/30 bg-slate-950/70 px-3 py-2',
      label: '제외',
      labelClassName: 'text-[10px] font-extrabold text-slate-300',
      value: toNumber(summary.excluded),
    },
  ],
});

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
  const videoTitle = getVideoTitle(sourceVideo);
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
  onOpenProductionCandidates,
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
    onOpenProductionCandidates,
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
