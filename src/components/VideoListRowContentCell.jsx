import VideoListRowBadges from './VideoListRowBadges';
import VideoListRowMetaActions from './VideoListRowMetaActions';
import VideoListRowThumbnail from './VideoListRowThumbnail';

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
          <a
            href={videoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-base font-extrabold text-slate-900 hover:text-indigo-600 line-clamp-2 leading-snug mb-2"
            title={videoTitle}
            aria-label={`${videoTitle} YouTube 원본 영상 열기`}
          >
            {videoTitle}
          </a>
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
