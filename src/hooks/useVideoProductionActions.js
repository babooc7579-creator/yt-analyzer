import { PRODUCTION_STATUS, VIDEO_STATUS, hasAnyVideoStatus } from '../constants/status';

export function useVideoProductionActions({
  isVideoSaved,
  markVideoStatus,
  toggleScrapVideo,
  videoUserRecords,
}) {
  const isProductionCandidate = (videoId) => (
    hasAnyVideoStatus(videoUserRecords[videoId], [
      VIDEO_STATUS.PRODUCTION_CANDIDATE,
      PRODUCTION_STATUS.CANDIDATE,
    ])
  );

  const promoteVideoToProduction = async (video) => {
    if (!isVideoSaved(video.videoId)) {
      await toggleScrapVideo(video);
    }

    await markVideoStatus(video.videoId, PRODUCTION_STATUS.CANDIDATE);
  };

  return {
    isProductionCandidate,
    promoteVideoToProduction,
  };
}
