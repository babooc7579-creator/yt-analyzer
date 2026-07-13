import VideoCard from './VideoCard';

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function StoredVideoActionGrid({
  checkedVideos,
  isProductionCandidate,
  isVideoSaved,
  onFetchComments,
  onPromoteToProduction,
  onToggleCheck,
  onToggleScrap,
  videos,
}) {
  const checkedVideoIds = new Set(toArray(checkedVideos));

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
      {toArray(videos).map((video, index) => (
        <VideoCard
          key={video.videoId}
          video={video}
          rank={index + 1}
          isChecked={checkedVideoIds.has(video.videoId)}
          isSaved={Boolean(isVideoSaved?.(video.videoId))}
          isProductionCandidate={Boolean(isProductionCandidate?.(video.videoId))}
          showWorkPanel={false}
          onToggleCheck={onToggleCheck}
          onToggleScrap={onToggleScrap}
          onPromoteToProduction={onPromoteToProduction}
          onFetchComments={onFetchComments}
        />
      ))}
    </div>
  );
}
