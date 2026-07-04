import { useProductionKanbanActions } from '../hooks/useProductionKanbanActions';
import { useProductionKanbanData } from '../hooks/useProductionKanbanData';
import ProductionKanbanContent from './ProductionKanbanContent';
import ProductionKanbanEmptyState from './ProductionKanbanEmptyState';

export default function ProductionKanban({
  discoveryLinks = [],
  videos,
  videoUserRecords,
  onMoveVideo,
  onOpenDiscoveryLinks,
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
  } = useProductionKanbanActions({
    onMoveVideo,
    onUpdateDiscoveryLink,
    onUpdateVideoRecord,
    videoUserRecords,
  });

  const {
    discoveryLinkCandidates,
    groupedVideos,
    productionSummary,
  } = useProductionKanbanData({
    discoveryLinks,
    draftRecords,
    videoUserRecords,
    videos,
  });

  if (videos.length === 0 && discoveryLinkCandidates.length === 0) {
    return (
      <ProductionKanbanEmptyState
        onOpenDiscoveryLinks={onOpenDiscoveryLinks}
        onOpenReferenceVault={onOpenReferenceVault}
      />
    );
  }

  const contentProps = {
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
    videoCount: videos.length,
    videoUserRecords,
  };

  return (
    <ProductionKanbanContent {...contentProps} />
  );
}
