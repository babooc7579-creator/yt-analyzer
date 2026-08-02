import { PRODUCTION_STATUS, hasProductionStatus } from '../constants/status';

export function useVideoProductionActions({
  ensureProductionVideoSource,
  markVideoStatus,
  rollbackCreatedProductionVideoSource,
  videoUserRecords,
}) {
  const isProductionCandidate = (videoId) => (
    hasProductionStatus(videoUserRecords[videoId], PRODUCTION_STATUS.CANDIDATE)
  );

  const promoteVideoToProduction = async (video) => {
    const sourceResult = await ensureProductionVideoSource(video);
    const sourceReady = sourceResult === true || sourceResult?.ready === true;
    if (!sourceReady) return false;

    const statusSaved = await markVideoStatus(video.videoId, PRODUCTION_STATUS.CANDIDATE);
    if (statusSaved) return true;

    if (
      sourceResult?.createdProductionOnlySource
      && typeof rollbackCreatedProductionVideoSource === 'function'
    ) {
      await rollbackCreatedProductionVideoSource(video.videoId);
    }

    return false;
  };

  return {
    isProductionCandidate,
    promoteVideoToProduction,
  };
}
