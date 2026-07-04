import { useScrapbook } from './useScrapbook';
import { useVideoExplorerState } from './useVideoExplorerState';
import { useVideoProductionActions } from './useVideoProductionActions';
import { useVideoSelection } from './useVideoSelection';
import { useVideoUserRecords } from './useVideoUserRecords';

export function useCreatorAppVideoWorkflow({ videos }) {
  const {
    savedVideos,
    scrapbookSyncWarning,
    isVideoSaved,
    toggleScrapVideo,
  } = useScrapbook();
  const {
    videoUserRecords,
    videoRecordsSyncWarning,
    markVideoStatus: markRadarVideoStatus,
    updateVideoUserRecord,
    restoreVideoToRadar,
    clearRadarDecisions,
  } = useVideoUserRecords();
  const {
    isProductionCandidate,
    promoteVideoToProduction,
  } = useVideoProductionActions({
    isVideoSaved,
    markVideoStatus: markRadarVideoStatus,
    toggleScrapVideo,
    videoUserRecords,
  });
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
    clearRadarDecisions,
    copiedPrompt,
    copyPromptForVideos,
    filteredAndSortedVideos,
    isProductionCandidate,
    isVideoSaved,
    lengthFilter,
    markRadarVideoStatus,
    promoteVideoToProduction,
    promptCopyError,
    restoreVideoToRadar,
    savedVideos,
    scrapbookSyncWarning,
    searchKeyword,
    setLengthFilter,
    setSearchKeyword,
    setSortType,
    setTtoTtoMode,
    setViewFilter,
    setViewMode,
    sortType,
    toggleCheckVideo,
    toggleScrapVideo,
    ttoTtoMode,
    updateVideoUserRecord,
    videoRecordsSyncWarning,
    videoUserRecords,
    viewFilter,
    viewMode,
  };
}
