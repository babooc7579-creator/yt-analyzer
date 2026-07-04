import { hasStrongReaction, isTtoTtoCandidate, TTOTTO_MIN_DAYS_OLD, TTOTTO_MIN_MULTIPLIER } from '../utils/video';
import { getYouTubeVideoUrl } from '../utils/urls';
import VideoCardCandidateReasons from './VideoCardCandidateReasons';
import VideoCardMetaActions from './VideoCardMetaActions';
import VideoCardPrimaryActions from './VideoCardPrimaryActions';
import VideoCardStatsGrid from './VideoCardStatsGrid';
import VideoCardStatusBadges from './VideoCardStatusBadges';
import VideoCardThumbnail from './VideoCardThumbnail';
import VideoCardTitleLink from './VideoCardTitleLink';

export default function VideoCard({
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
}) {
  const videoTitle = video.title || '제목 없는 영상';
  const isStrongReaction = hasStrongReaction(video);
  const isCandidate = isStrongReaction || isTtoTtoCandidate(video);
  const thumbnailHeightClass = showWorkPanel ? 'min-h-[360px]' : 'min-h-[420px]';
  const videoUrl = getYouTubeVideoUrl(video.videoId);
  const candidateReasons = [
    video.multiplier >= TTOTTO_MIN_MULTIPLIER ? `평균 대비 ${video.multiplier.toFixed(1)}배` : null,
    video.daysOld >= TTOTTO_MIN_DAYS_OLD ? `${video.daysOld}일 지난 소재` : null,
    isStrongReaction ? '강한 참여 반응' : null,
  ].filter(Boolean);

  const thumbnailProps = {
    isCandidate,
    isChecked,
    isSaved,
    isStrongReaction,
    onToggleCheck,
    onToggleScrap,
    rank,
    thumbnailHeightClass,
    video,
    videoTitle,
  };

  const statusBadgeProps = {
    isChecked,
    isProductionCandidate,
    isSaved,
  };

  const metaActionsProps = {
    onFetchComments,
    video,
    videoTitle,
    videoUrl,
  };

  const primaryActionsProps = {
    isProductionCandidate,
    isSaved,
    onPromoteToProduction,
    onToggleScrap,
    video,
    videoTitle,
  };

  const statsGridProps = {
    isStrongReaction,
    showWorkPanel,
    video,
  };

  return (
    <div className={`group overflow-hidden rounded-lg border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${isChecked ? 'border-indigo-300 bg-indigo-50' : isCandidate ? 'border-rose-100 bg-white' : 'border-slate-200 bg-white'}`}>
      <VideoCardThumbnail {...thumbnailProps} />
      <div className={`${showWorkPanel ? 'p-5' : 'p-4'}`}>
        <VideoCardTitleLink videoTitle={videoTitle} videoUrl={videoUrl} />
        <VideoCardCandidateReasons candidateReasons={candidateReasons} />
        <VideoCardStatusBadges {...statusBadgeProps} />
        <VideoCardMetaActions {...metaActionsProps} />

        <VideoCardPrimaryActions {...primaryActionsProps} />

        <VideoCardStatsGrid {...statsGridProps} />
      </div>
    </div>
  );
}
