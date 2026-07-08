import { getLanguageLabel } from '../constants/languages';
import {
  hasStrongReaction,
  isTtoTtoCandidate,
  TTOTTO_MIN_DAYS_OLD,
  TTOTTO_MIN_MULTIPLIER,
} from './video';
import { getYouTubeVideoUrl } from './urls';

const toArray = (items) => (Array.isArray(items) ? items : []);

export const getVideoCardCandidateReasons = ({ video, isStrongReaction }) => [
  video.multiplier >= TTOTTO_MIN_MULTIPLIER ? `평균 대비 ${video.multiplier.toFixed(1)}배` : null,
  video.daysOld >= TTOTTO_MIN_DAYS_OLD ? `${video.daysOld}일 지난 소재` : null,
  isStrongReaction ? '강한 참여 반응' : null,
].filter(Boolean);

export const getVideoCardCandidateReasonsViewProps = ({ candidateReasons }) => {
  const reasonList = toArray(candidateReasons);

  return {
    joinedReasons: reasonList.join(' · '),
    reasonList,
    shouldShow: reasonList.length > 0,
    title: '후보 이유',
  };
};

export const getVideoCardCopyUrlButtonProps = ({ videoTitle, videoUrl }) => ({
  ariaLabel: `${videoTitle} YouTube 원본 URL 복사`,
  copiedLabel: '복사 완료',
  label: 'URL 복사',
  title: 'YouTube 원본 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다.',
  url: videoUrl,
});

export const getVideoCardMetaBadgesViewProps = ({ video }) => ({
  durationBadge: {
    isShorts: video.isShorts,
    text: video.isShorts ? `Shorts (${video.duration})` : video.duration,
  },
  languageLabel: getLanguageLabel(video.language) || '언어 미상',
});

export const getVideoCardStatusBadgeItems = ({
  isChecked,
  isProductionCandidate,
  isSaved,
}) => [
  {
    className: 'rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700',
    isVisible: isSaved,
    label: '소재 보관됨',
  },
  {
    className: 'rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700',
    isVisible: isProductionCandidate,
    label: '후보함 등록',
  },
  {
    className: 'rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700',
    isVisible: isChecked,
    label: 'AI 요청문 선택',
  },
];

export const getVideoCardStatsGridViewProps = ({
  isStrongReaction,
  showWorkPanel,
  video,
}) => {
  const statPaddingClass = showWorkPanel ? 'p-3' : 'p-2.5';

  return {
    daysOldTileProps: {
      className: video.daysOld >= TTOTTO_MIN_DAYS_OLD ? 'border-orange-100 bg-orange-50 text-orange-700' : 'border-slate-200 bg-slate-50 text-slate-700',
      label: '경과일',
      paddingClassName: statPaddingClass,
    },
    daysOldText: `${video.daysOld}일`,
    engagementLikeText: `좋아요 ${video.like_count.toLocaleString()}`,
    engagementText: `${video.like_ratio}%`,
    engagementTextClassName: `text-sm font-extrabold ${video.like_ratio >= 3 ? 'text-rose-600' : 'text-slate-800'}`,
    engagementTileProps: {
      label: '참여율',
      paddingClassName: statPaddingClass,
    },
    multiplierText: `${video.multiplier.toFixed(1)}x`,
    multiplierTileProps: {
      className: isStrongReaction ? 'border-rose-500 bg-rose-600 text-white' : video.multiplier >= TTOTTO_MIN_MULTIPLIER ? 'border-indigo-100 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-700',
      label: '대박 지수',
      labelClassName: isStrongReaction ? 'text-rose-100' : 'text-slate-400',
      paddingClassName: statPaddingClass,
    },
    viewCountText: video.view_count.toLocaleString(),
    viewCountTileProps: {
      label: '총 조회수',
      paddingClassName: statPaddingClass,
    },
  };
};

export const getVideoCardThumbnailBadgeItems = ({
  isCandidate,
  isStrongReaction,
  rank,
}) => [
  {
    className: 'rounded-full bg-black/75 px-2.5 py-1 text-xs font-extrabold text-white',
    icon: null,
    isVisible: true,
    label: `#${rank}`,
  },
  {
    className: 'inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-extrabold text-white shadow-sm',
    icon: 'candidate',
    isVisible: isCandidate,
    label: '또터또 후보',
  },
  {
    className: 'inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700',
    icon: 'strong',
    isVisible: isStrongReaction,
    label: '강한 반응',
  },
];

export const getVideoThumbnailAltText = ({ videoTitle }) => `${videoTitle} 썸네일`;

export const getVideoTitleLinkAriaLabel = ({ videoTitle }) => `${videoTitle} YouTube 원본 영상 열기`;

export const getVideoCardViewProps = ({
  video,
  rank,
  isChecked,
  isSaved,
  isProductionCandidate,
  showWorkPanel,
  onToggleCheck,
  onToggleScrap,
  onPromoteToProduction,
  onFetchComments,
}) => {
  const videoTitle = video.title || '제목 없는 영상';
  const isStrongReactionVideo = hasStrongReaction(video);
  const isCandidate = isStrongReactionVideo || isTtoTtoCandidate(video);
  const thumbnailHeightClass = showWorkPanel ? 'min-h-[360px]' : 'min-h-[420px]';
  const videoUrl = getYouTubeVideoUrl(video.videoId);
  const candidateReasons = getVideoCardCandidateReasons({
    video,
    isStrongReaction: isStrongReactionVideo,
  });

  return {
    cardClassName: `group overflow-hidden rounded-lg border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${isChecked ? 'border-indigo-300 bg-indigo-50' : isCandidate ? 'border-rose-100 bg-white' : 'border-slate-200 bg-white'}`,
    contentClassName: showWorkPanel ? 'p-5' : 'p-4',
    candidateReasons,
    thumbnailProps: {
      isCandidate,
      isChecked,
      isSaved,
      isStrongReaction: isStrongReactionVideo,
      onToggleCheck,
      onToggleScrap,
      rank,
      thumbnailHeightClass,
      video,
      videoTitle,
    },
    statusBadgeProps: {
      isChecked,
      isProductionCandidate,
      isSaved,
    },
    metaActionsProps: {
      onFetchComments,
      video,
      videoTitle,
      videoUrl,
    },
    primaryActionsProps: {
      isProductionCandidate,
      isSaved,
      onPromoteToProduction,
      onToggleScrap,
      video,
      videoTitle,
    },
    statsGridProps: {
      isStrongReaction: isStrongReactionVideo,
      showWorkPanel,
      video,
    },
    videoTitle,
    videoUrl,
  };
};
