import VideoCardThumbnailActions from './VideoCardThumbnailActions';
import VideoCardThumbnailBadges from './VideoCardThumbnailBadges';

export default function VideoCardThumbnail({
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
}) {
  return (
    <div className={`relative overflow-hidden bg-slate-100 ${thumbnailHeightClass}`}>
      <img src={video.thumbnail} alt={`${videoTitle} 썸네일`} className={`h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02] ${thumbnailHeightClass}`} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
      <VideoCardThumbnailBadges
        isCandidate={isCandidate}
        isStrongReaction={isStrongReaction}
        rank={rank}
      />
      <VideoCardThumbnailActions
        isChecked={isChecked}
        isSaved={isSaved}
        onToggleCheck={onToggleCheck}
        onToggleScrap={onToggleScrap}
        video={video}
        videoTitle={videoTitle}
      />
    </div>
  );
}
