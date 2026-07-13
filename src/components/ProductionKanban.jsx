import { useProductionKanbanActions } from '../hooks/useProductionKanbanActions';
import { useProductionKanbanData } from '../hooks/useProductionKanbanData';
import {
  getProductionKanbanContentProps,
  shouldShowProductionKanbanEmptyState,
} from '../utils/productionKanbanProps';
import ProductionKanbanContent from './ProductionKanbanContent';
import ProductionKanbanEmptyState from './ProductionKanbanEmptyState';

export default function ProductionKanban({
  discoveryLinks = [],
  videos,
  videoUserRecords,
  onMoveVideo,
  onOpenDiscoveryLinks,
  onOpenHome,
  onUpdateDiscoveryLink,
  onUpdateVideoRecord,
  onOpenReferenceVault,
}) {
  const {
    draftRecords,
    hasUnsavedChanges,
    linkMoveStates,
    moveDiscoveryLink,
    moveStates,
    moveVideo,
    saveDraftRecord,
    saveStates,
    updateDraftRecord,
    updateVideoFocus,
  } = useProductionKanbanActions({
    onMoveVideo,
    onUpdateDiscoveryLink,
    onUpdateVideoRecord,
    videoUserRecords,
  });

  const {
    discoveryLinkCandidates,
    focusVideos,
    groupedVideos,
    productionSummary,
  } = useProductionKanbanData({
    discoveryLinks,
    draftRecords,
    videoUserRecords,
    videos,
  });

  if (shouldShowProductionKanbanEmptyState({ discoveryLinkCandidates, productionSummary })) {
    return (
      <ProductionKanbanEmptyState
        onOpenDiscoveryLinks={onOpenDiscoveryLinks}
        onOpenHome={onOpenHome}
        onOpenReferenceVault={onOpenReferenceVault}
      />
    );
  }

  const contentProps = getProductionKanbanContentProps({
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
    productionSummary,
    saveDraftRecord,
    saveStates,
    updateDraftRecord,
    updateVideoFocus,
    videoUserRecords,
  });

  return (
    <ProductionKanbanContent {...contentProps} />
  );
}
