import { useMemo } from 'react';

import { getProductionKanbanDataModel } from '../utils/productionKanbanData';

export function useProductionKanbanData({
  discoveryLinks,
  draftRecords,
  videoUserRecords,
  videos,
}) {
  return useMemo(() => getProductionKanbanDataModel({
    discoveryLinks,
    draftRecords,
    videoUserRecords,
    videos,
  }), [discoveryLinks, draftRecords, videoUserRecords, videos]);
}
