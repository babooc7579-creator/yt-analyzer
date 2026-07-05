import ReferenceVaultEmptyState from './ReferenceVaultEmptyState';
import VideoCard from './VideoCard';
import VideoFilterEmptyState from './VideoFilterEmptyState';
import VideoListTable from './VideoListTable';

const toArray = (items) => (Array.isArray(items) ? items : []);

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
  const checkedVideoList = toArray(checkedVideos);
  const filteredVideoList = toArray(filteredVideos);
  const videoList = toArray(videos);

  const getVideoCardProps = (video, index) => ({
    video,
    rank: index + 1,
    isChecked: checkedVideoList.includes(video.videoId),
    isSaved: isVideoSaved(video.videoId),
    isProductionCandidate: isProductionCandidate(video.videoId),
    showWorkPanel,
    onToggleCheck,
    onToggleScrap,
    onPromoteToProduction,
    onFetchComments,
  });

  const listTableProps = {
    videos: filteredVideoList,
    checkedVideos: checkedVideoList,
    isVideoSaved,
    isProductionCandidate,
    toggleCheckVideo: onToggleCheck,
    toggleScrapVideo: onToggleScrap,
    promoteVideoToProduction: onPromoteToProduction,
    fetchTopComments: onFetchComments,
  };

  return (
    <>
      {videoList.length === 0 ? (
        <ReferenceVaultEmptyState />
      ) : filteredVideoList.length === 0 ? (
        <VideoFilterEmptyState />
      ) : viewMode === 'card' ? (
        <div className={`flex-1 overflow-y-auto bg-slate-100 ${showWorkPanel ? 'p-5' : 'p-6'}`}>
          <div className={`grid gap-6 ${showWorkPanel ? 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[2300px]:grid-cols-5'}`}>
            {filteredVideoList.map((video, index) => (
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
