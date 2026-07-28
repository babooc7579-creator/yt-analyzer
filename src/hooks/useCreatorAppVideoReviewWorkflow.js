import { useScrapbook } from './useScrapbook';
import { useVideoProductionActions } from './useVideoProductionActions';
import { useVideoUserRecords } from './useVideoUserRecords';

export function useCreatorAppVideoReviewWorkflow() {
  const {
    savedVideos,
    scrapbookSyncWarning,
    isVideoSaved,
    retryScrapbookSync,
    toggleScrapVideo,
  } = useScrapbook();
  const {
    videoUserRecords,
    videoRecordsSyncWarning,
    retryVideoUserRecordsSync,
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

  return {
    clearRadarDecisions,
    isProductionCandidate,
    isVideoSaved,
    markRadarVideoStatus,
    promoteVideoToProduction,
    restoreVideoToRadar,
    retryScrapbookSync,
    retryVideoUserRecordsSync,
    savedVideos,
    scrapbookSyncWarning,
    toggleScrapVideo,
    updateVideoUserRecord,
    videoRecordsSyncWarning,
    videoUserRecords,
  };
}
