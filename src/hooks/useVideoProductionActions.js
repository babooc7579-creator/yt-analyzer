import { PRODUCTION_STATUS, hasProductionStatus } from '../constants/status';

export function useVideoProductionActions({
  isVideoSaved,
  markVideoStatus,
  toggleScrapVideo,
  videoUserRecords,
}) {
  const isProductionCandidate = (videoId) => (
    hasProductionStatus(videoUserRecords[videoId], PRODUCTION_STATUS.CANDIDATE)
  );

  const promoteVideoToProduction = async (video) => {
    if (!isVideoSaved(video.videoId)) {
      const savedToScrapbook = await toggleScrapVideo(video);
      if (!savedToScrapbook) return false;
    }

    return markVideoStatus(video.videoId, PRODUCTION_STATUS.CANDIDATE);
  };

  return {
    isProductionCandidate,
    promoteVideoToProduction,
  };
}
