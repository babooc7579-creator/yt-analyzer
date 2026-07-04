import { useAppSyncWarnings } from './useAppSyncWarnings';
import { useCreatorOsMetrics } from './useCreatorOsMetrics';

export function useCreatorAppDerivedState({
  categories,
  discoveryLinks,
  savedChannels,
  savedVideos,
  scrapbookSyncWarning,
  selectedChannelIds,
  videoRecordsSyncWarning,
  videoUserRecords,
  videos,
}) {
  const metrics = useCreatorOsMetrics({
    categories,
    discoveryLinks,
    savedChannels,
    savedVideos,
    selectedChannelIds,
    videoUserRecords,
    videos,
  });

  const syncWarnings = useAppSyncWarnings({
    scrapbookSyncWarning,
    videoRecordsSyncWarning,
  });

  return {
    ...metrics,
    syncWarnings,
  };
}
