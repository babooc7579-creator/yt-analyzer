import { useMemo } from 'react';

import { getRadarCandidateDataModel } from '../utils/radarCandidates';

export function useRadarCandidateData({
  videoUserRecords,
  videos,
}) {
  return useMemo(() => getRadarCandidateDataModel({
    videoUserRecords,
    videos,
  }), [videoUserRecords, videos]);
}
