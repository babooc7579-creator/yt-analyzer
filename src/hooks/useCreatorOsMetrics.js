import { useMemo } from 'react';

import { getCreatorOsMetricsModel } from '../utils/creatorOsMetrics';

export function useCreatorOsMetrics({
  categories,
  discoveryLinks = [],
  savedChannels,
  savedVideos,
  selectedChannelIds,
  videoUserRecords,
  videos,
}) {
  return useMemo(() => getCreatorOsMetricsModel({
    categories,
    discoveryLinks,
    savedChannels,
    savedVideos,
    selectedChannelIds,
    videoUserRecords,
    videos,
  }), [
    categories,
    discoveryLinks,
    savedChannels,
    savedVideos,
    selectedChannelIds,
    videoUserRecords,
    videos,
  ]);
}
