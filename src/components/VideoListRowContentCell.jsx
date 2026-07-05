import { getVideoListRowContentViewProps } from '../utils/videoListRowContentProps';
import VideoListRowBadges from './VideoListRowBadges';
import VideoListRowMetaActions from './VideoListRowMetaActions';
import VideoListRowThumbnail from './VideoListRowThumbnail';
import VideoListRowTitleLink from './VideoListRowTitleLink';

export default function VideoListRowContentCell({
  fetchTopComments,
  isChecked,
  isProductionCandidate,
  isSaved,
  isStrongReaction,
  isTtoTto,
  video,
  videoTitle,
  videoUrl,
}) {
  const {
    badgesProps,
    metaActionsProps,
    thumbnailProps,
    titleLinkProps,
  } = getVideoListRowContentViewProps({
    fetchTopComments,
    isChecked,
    isProductionCandidate,
    isSaved,
    isStrongReaction,
    isTtoTto,
    video,
    videoTitle,
    videoUrl,
  });

  return (
    <td className="px-4 py-5 min-w-[520px]">
      <div className="flex gap-5">
        <VideoListRowThumbnail {...thumbnailProps} />
        <div className="flex flex-col justify-center min-w-0">
          <VideoListRowBadges {...badgesProps} />
          <VideoListRowTitleLink {...titleLinkProps} />
          <VideoListRowMetaActions {...metaActionsProps} />
        </div>
      </div>
    </td>
  );
}
