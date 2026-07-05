import {
  hasStrongReaction,
  isTtoTtoCandidate,
  TTOTTO_MIN_DAYS_OLD,
  TTOTTO_MIN_MULTIPLIER,
} from './video';
import { getYouTubeVideoUrl } from './urls';

export const getVideoCardCandidateReasons = ({ video, isStrongReaction }) => [
  video.multiplier >= TTOTTO_MIN_MULTIPLIER ? `평균 대비 ${video.multiplier.toFixed(1)}배` : null,
  video.daysOld >= TTOTTO_MIN_DAYS_OLD ? `${video.daysOld}일 지난 소재` : null,
  isStrongReaction ? '강한 참여 반응' : null,
].filter(Boolean);

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
