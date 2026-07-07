import { getProductionKanbanContentChildProps } from '../utils/productionKanbanProps';
import ProductionDiscoveryLinksSection from './ProductionDiscoveryLinksSection';
import ProductionKanbanBoard from './ProductionKanbanBoard';
import ProductionKanbanSummary from './ProductionKanbanSummary';

export default function ProductionKanbanContent({
  discoveryLinkCandidates,
  draftRecords,
  groupedVideos,
  hasUnsavedChanges,
  linkMoveStates,
  moveDiscoveryLink,
  moveStates,
  moveVideo,
  onOpenDiscoveryLinks,
  productionSummary,
  saveDraftRecord,
  saveStates,
  updateDraftRecord,
  videoCount,
  videoUserRecords,
}) {
  const {
    boardProps,
    discoveryLinksSectionProps,
    summaryProps,
  } = getProductionKanbanContentChildProps({
    discoveryLinkCandidates,
    draftRecords,
    groupedVideos,
    hasUnsavedChanges,
    linkMoveStates,
    moveDiscoveryLink,
    moveStates,
    moveVideo,
    onOpenDiscoveryLinks,
    productionSummary,
    saveDraftRecord,
    saveStates,
    updateDraftRecord,
    videoCount,
    videoUserRecords,
  });

  return (
    <div className="space-y-4">
      <ProductionKanbanSummary {...summaryProps} />

      <ProductionDiscoveryLinksSection {...discoveryLinksSectionProps} />

      <ProductionKanbanBoard {...boardProps} />
    </div>
  );
}
