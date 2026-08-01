import { useScrapbook } from './useScrapbook';
import { useVideoProductionActions } from './useVideoProductionActions';
import { useVideoUserRecords } from './useVideoUserRecords';
import { PRODUCTION_STATUSES, hasAnyProductionStatus } from '../constants/status';

export function useCreatorAppVideoReviewWorkflow({ collectedVideos = [] } = {}) {
  const {
    ensureProductionVideoSource,
    productionSourceVideos,
    savedVideos,
    scrapbookSyncWarning,
    isVideoSaved,
    retryScrapbookSync,
    toggleScrapVideo: toggleCloudScrapVideo,
  } = useScrapbook({ collectedVideos });
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
    ensureProductionVideoSource,
    markVideoStatus: markRadarVideoStatus,
    videoUserRecords,
  });
  const toggleScrapVideo = (video, options = {}) => {
    const preserveForProduction = Object.prototype.hasOwnProperty.call(options, 'preserveForProduction')
      ? Boolean(options.preserveForProduction)
      : hasAnyProductionStatus(videoUserRecords[video?.videoId], PRODUCTION_STATUSES);

    return toggleCloudScrapVideo(video, { preserveForProduction });
  };

  return {
    clearRadarDecisions,
    isProductionCandidate,
    isVideoSaved,
    markRadarVideoStatus,
    promoteVideoToProduction,
    productionSourceVideos,
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
