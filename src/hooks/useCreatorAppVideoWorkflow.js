import { useCreatorAppVideoReviewWorkflow } from './useCreatorAppVideoReviewWorkflow';
import { useVideoExplorerState } from './useVideoExplorerState';
import { useVideoSelection } from './useVideoSelection';

export function useCreatorAppVideoWorkflow({ videos }) {
  const reviewWorkflow = useCreatorAppVideoReviewWorkflow({ collectedVideos: videos });
  const {
    filteredAndSortedVideos,
    lengthFilter,
    searchKeyword,
    setLengthFilter,
    setSearchKeyword,
    setSortType,
    setTtoTtoMode,
    setViewFilter,
    setViewMode,
    sortType,
    ttoTtoMode,
    viewFilter,
    viewMode,
  } = useVideoExplorerState(videos);
  const {
    checkedVideos,
    clearCheckedVideos,
    copiedPrompt,
    copyPromptForVideos,
    promptCopyError,
    toggleCheckVideo,
  } = useVideoSelection();

  return {
    checkedVideos,
    clearCheckedVideos,
    clearRadarDecisions: reviewWorkflow.clearRadarDecisions,
    copiedPrompt,
    copyPromptForVideos,
    filteredAndSortedVideos,
    isProductionCandidate: reviewWorkflow.isProductionCandidate,
    isVideoSaved: reviewWorkflow.isVideoSaved,
    lengthFilter,
    markRadarVideoStatus: reviewWorkflow.markRadarVideoStatus,
    promoteVideoToProduction: reviewWorkflow.promoteVideoToProduction,
    productionSourceVideos: reviewWorkflow.productionSourceVideos,
    promptCopyError,
    restoreVideoToRadar: reviewWorkflow.restoreVideoToRadar,
    retryScrapbookSync: reviewWorkflow.retryScrapbookSync,
    retryVideoUserRecordsSync: reviewWorkflow.retryVideoUserRecordsSync,
    savedVideos: reviewWorkflow.savedVideos,
    scrapbookSyncWarning: reviewWorkflow.scrapbookSyncWarning,
    searchKeyword,
    setLengthFilter,
    setSearchKeyword,
    setSortType,
    setTtoTtoMode,
    setViewFilter,
    setViewMode,
    sortType,
    toggleCheckVideo,
    toggleScrapVideo: reviewWorkflow.toggleScrapVideo,
    ttoTtoMode,
    updateVideoUserRecord: reviewWorkflow.updateVideoUserRecord,
    videoRecordsSyncWarning: reviewWorkflow.videoRecordsSyncWarning,
    videoUserRecords: reviewWorkflow.videoUserRecords,
    viewFilter,
    viewMode,
  };
}
