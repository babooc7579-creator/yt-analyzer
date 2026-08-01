import { PRODUCTION_STATUS, hasProductionStatus } from '../constants/status';

export function useVideoProductionActions({
  ensureProductionVideoSource,
  markVideoStatus,
  videoUserRecords,
}) {
  const isProductionCandidate = (videoId) => (
    hasProductionStatus(videoUserRecords[videoId], PRODUCTION_STATUS.CANDIDATE)
  );

  const promoteVideoToProduction = async (video) => {
    const sourceReady = await ensureProductionVideoSource(video);
    if (!sourceReady) return false;

    return markVideoStatus(video.videoId, PRODUCTION_STATUS.CANDIDATE);
  };

  return {
    isProductionCandidate,
    promoteVideoToProduction,
  };
}
