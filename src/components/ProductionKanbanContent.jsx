import { getProductionKanbanContentChildProps } from '../utils/productionKanbanProps';
import ProductionDiscoveryLinksSection from './ProductionDiscoveryLinksSection';
import ProductionFocusSection from './ProductionFocusSection';
import ProductionKanbanBoard from './ProductionKanbanBoard';
import ProductionKanbanNextActions from './ProductionKanbanNextActions';
import ProductionKanbanSummary from './ProductionKanbanSummary';

export default function ProductionKanbanContent({
  activeFilterMode,
  discoveryLinkCandidates,
  draftRecords,
  focusVideos,
  groupedVideos,
  hasUnsavedChanges,
  linkMoveStates,
  moveDiscoveryLink,
  moveStates,
  moveVideo,
  onOpenDiscoveryLinks,
  onOpenReferenceVault,
  onOpenScriptBoard,
  onOpenUploadCalendar,
  overallDiscoveryLinkCandidateCount,
  overallProductionSummary,
  productionSummary,
  saveDraftRecord,
  saveStates,
  updateDraftRecord,
  updateVideoFocus,
  videoCount,
  videoUserRecords,
}) {
  const {
    boardProps,
    discoveryLinksSectionProps,
    focusSectionProps,
    nextActionsProps,
    summaryProps,
  } = getProductionKanbanContentChildProps({
    activeFilterMode,
    discoveryLinkCandidates,
    draftRecords,
    focusVideos,
    groupedVideos,
    hasUnsavedChanges,
    linkMoveStates,
    moveDiscoveryLink,
    moveStates,
    moveVideo,
    onOpenDiscoveryLinks,
    onOpenReferenceVault,
    onOpenScriptBoard,
    onOpenUploadCalendar,
    overallDiscoveryLinkCandidateCount,
    overallProductionSummary,
    productionSummary,
    saveDraftRecord,
    saveStates,
    updateDraftRecord,
    updateVideoFocus,
    videoCount,
    videoUserRecords,
  });

  return (
    <div className="space-y-4">
      <ProductionKanbanSummary {...summaryProps} />

      <ProductionFocusSection {...focusSectionProps} />

      <ProductionKanbanNextActions {...nextActionsProps} />

      <ProductionDiscoveryLinksSection {...discoveryLinksSectionProps} />

      <ProductionKanbanBoard {...boardProps} />
    </div>
  );
}
