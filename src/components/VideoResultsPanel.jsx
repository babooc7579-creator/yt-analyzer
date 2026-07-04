import ReferenceVaultEmptyState from './ReferenceVaultEmptyState';
import VideoCard from './VideoCard';
import VideoFilterEmptyState from './VideoFilterEmptyState';
import VideoListTable from './VideoListTable';

export default function VideoResultsPanel({
  checkedVideos,
  filteredVideos,
  isProductionCandidate,
  isVideoSaved,
  onFetchComments,
  onPromoteToProduction,
  onToggleCheck,
  onToggleScrap,
  showWorkPanel,
  videos,
  viewMode,
}) {
  const getVideoCardProps = (video, index) => ({
    video,
    rank: index + 1,
    isChecked: checkedVideos.includes(video.videoId),
    isSaved: isVideoSaved(video.videoId),
    isProductionCandidate: isProductionCandidate(video.videoId),
    showWorkPanel,
    onToggleCheck,
    onToggleScrap,
    onPromoteToProduction,
    onFetchComments,
  });

  const listTableProps = {
    videos: filteredVideos,
    checkedVideos,
    isVideoSaved,
    isProductionCandidate,
    toggleCheckVideo: onToggleCheck,
    toggleScrapVideo: onToggleScrap,
    promoteVideoToProduction: onPromoteToProduction,
    fetchTopComments: onFetchComments,
  };

  return (
    <>
      {videos.length === 0 ? (
        <ReferenceVaultEmptyState />
      ) : filteredVideos.length === 0 ? (
        <VideoFilterEmptyState />
      ) : viewMode === 'card' ? (
        <div className={`flex-1 overflow-y-auto bg-slate-100 ${showWorkPanel ? 'p-5' : 'p-6'}`}>
          <div className={`grid gap-6 ${showWorkPanel ? 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[2300px]:grid-cols-5'}`}>
            {filteredVideos.map((video, index) => (
              <VideoCard key={video.videoId} {...getVideoCardProps(video, index)} />
            ))}
          </div>
        </div>
      ) : (
        <VideoListTable {...listTableProps} />
      )}
    </>
  );
}
