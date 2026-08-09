import { useEffect, useState } from 'react';

import { getVideoResultsPanelViewProps } from '../utils/videoResultsPanelProps';
import ReferenceVaultEmptyState from './ReferenceVaultEmptyState';
import VideoCard from './VideoCard';
import VideoFilterEmptyState from './VideoFilterEmptyState';
import VideoListTable from './VideoListTable';
import VideoResultsProgress from './VideoResultsProgress';

export const VIDEO_RESULTS_PAGE_SIZE = 60;

export default function VideoResultsPanel({
  checkedVideos,
  filteredVideos,
  isProductionCandidate,
  isVideoSaved,
  onFetchComments,
  onOpenChannelWatchlist,
  onOpenHome,
  onOpenSelectedScan,
  onLoadStoredVideos,
  onPromoteToProduction,
  onResetFilters,
  onToggleCheck,
  onToggleScrap,
  showWorkPanel,
  selectedChannelCount,
  storedVideoLoadPending,
  storedVideoLoadResult,
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
    onOpenChannelWatchlist,
    onOpenHome,
    onOpenSelectedScan,
    onLoadStoredVideos,
    onPromoteToProduction,
    onResetFilters,
    onToggleCheck,
    onToggleScrap,
    showWorkPanel,
    selectedChannelCount,
    storedVideoLoadPending,
    storedVideoLoadResult,
    videos,
  });
  const [visibleState, setVisibleState] = useState(() => ({
    count: VIDEO_RESULTS_PAGE_SIZE,
    source: filteredVideoList,
  }));
  const visibleCount = visibleState.source === filteredVideoList
    ? visibleState.count
    : VIDEO_RESULTS_PAGE_SIZE;
  const visibleVideos = filteredVideoList.slice(0, visibleCount);

  useEffect(() => {
    if (visibleState.source !== filteredVideoList) {
      setVisibleState({ count: VIDEO_RESULTS_PAGE_SIZE, source: filteredVideoList });
    }
  }, [filteredVideoList, visibleState.source]);

  const showMoreVideos = () => {
    setVisibleState((current) => ({
      count: Math.min(
        (current.source === filteredVideoList ? current.count : VIDEO_RESULTS_PAGE_SIZE)
          + VIDEO_RESULTS_PAGE_SIZE,
        filteredVideoList.length,
      ),
      source: filteredVideoList,
    }));
  };
  const progressProps = {
    displayedCount: visibleVideos.length,
    onShowMore: showMoreVideos,
    pageSize: VIDEO_RESULTS_PAGE_SIZE,
    totalCount: filteredVideoList.length,
  };

  return (
    <>
      {videoList.length === 0 ? (
        <ReferenceVaultEmptyState {...referenceVaultEmptyStateProps} />
      ) : filteredVideoList.length === 0 ? (
        <VideoFilterEmptyState {...videoFilterEmptyStateProps} />
      ) : viewMode === 'card' ? (
        <div className={`flex-1 overflow-y-auto bg-slate-100 ${showWorkPanel ? 'p-5' : 'p-6'}`}>
          <div className={`grid gap-6 ${showWorkPanel ? 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[2300px]:grid-cols-5'}`}>
            {visibleVideos.map((video, index) => (
              <VideoCard key={video.videoId} {...getVideoCardProps(video, index)} />
            ))}
          </div>
          <VideoResultsProgress {...progressProps} />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <VideoListTable {...listTableProps} videos={visibleVideos} />
          <VideoResultsProgress {...progressProps} />
        </div>
      )}
    </>
  );
}
