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
  return (
    <td className="px-4 py-5 min-w-[520px]">
      <div className="flex gap-5">
        <VideoListRowThumbnail video={video} videoTitle={videoTitle} />
        <div className="flex flex-col justify-center min-w-0">
          <VideoListRowBadges
            isChecked={isChecked}
            isProductionCandidate={isProductionCandidate}
            isSaved={isSaved}
            isStrongReaction={isStrongReaction}
            isTtoTto={isTtoTto}
          />
          <VideoListRowTitleLink videoTitle={videoTitle} videoUrl={videoUrl} />
          <VideoListRowMetaActions
            fetchTopComments={fetchTopComments}
            video={video}
            videoTitle={videoTitle}
            videoUrl={videoUrl}
          />
        </div>
      </div>
    </td>
  );
}
