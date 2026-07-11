import { getVideoResultsPanelViewProps } from '../utils/videoResultsPanelProps';
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
  onOpenAddChannel,
  onOpenHome,
  onPromoteToProduction,
  onResetFilters,
  onToggleCheck,
  onToggleScrap,
  showWorkPanel,
  videos,
  viewMode,
}) {
  const {
    filteredVideoList,
    getVideoCardProps,
    listTableProps,
    referenceVaultEmptyStateProps,
    videoFilterEmptyStateProps,
    videoList,
  } = getVideoResultsPanelViewProps({
    checkedVideos,
    filteredVideos,
    isProductionCandidate,
    isVideoSaved,
    onFetchComments,
    onOpenAddChannel,
    onOpenHome,
    onPromoteToProduction,
    onResetFilters,
    onToggleCheck,
    onToggleScrap,
    showWorkPanel,
    videos,
  });

  return (
    <>
      {videoList.length === 0 ? (
        <ReferenceVaultEmptyState {...referenceVaultEmptyStateProps} />
      ) : filteredVideoList.length === 0 ? (
        <VideoFilterEmptyState {...videoFilterEmptyStateProps} />
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
