import { useMemo } from 'react';

import { getIsoTodayDate } from '../utils/dates';
import {
  getDiscoveryLinkCandidates,
  getProductionSummary,
  groupProductionVideos,
} from '../utils/productionKanbanData';

export function useProductionKanbanData({
  discoveryLinks,
  draftRecords,
  videoUserRecords,
  videos,
}) {
  const discoveryLinkCandidates = useMemo(() => (
    getDiscoveryLinkCandidates(discoveryLinks)
  ), [discoveryLinks]);

  const groupedVideos = useMemo(() => (
    groupProductionVideos(videos, videoUserRecords)
  ), [videos, videoUserRecords]);

  const productionSummary = useMemo(() => {
    return getProductionSummary({
      discoveryLinkCandidates,
      draftRecords,
      groupedVideos,
      today: getIsoTodayDate(),
      videoUserRecords,
      videos,
    });
  }, [discoveryLinkCandidates, draftRecords, groupedVideos, videoUserRecords, videos]);

  return {
    discoveryLinkCandidates,
    groupedVideos,
    productionSummary,
  };
}
