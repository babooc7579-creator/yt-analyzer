import { getVideoCardViewProps } from '../utils/videoCard';
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
  const {
    cardClassName,
    candidateReasons,
    contentClassName,
    metaActionsProps,
    primaryActionsProps,
    statsGridProps,
    statusBadgeProps,
    thumbnailProps,
    videoTitle,
    videoUrl,
  } = getVideoCardViewProps({
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
  });

  return (
    <div className={cardClassName}>
      <VideoCardThumbnail {...thumbnailProps} />
      <div className={contentClassName}>
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
