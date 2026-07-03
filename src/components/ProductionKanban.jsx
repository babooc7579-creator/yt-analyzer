import { PRODUCTION_KANBAN_COLUMNS } from '../constants/productionKanban';
import { useProductionKanbanActions } from '../hooks/useProductionKanbanActions';
import { useProductionKanbanData } from '../hooks/useProductionKanbanData';
import { getProductionScheduleSignal } from '../utils/productionSchedule';
import ProductionDiscoveryLinksSection from './ProductionDiscoveryLinksSection';
import ProductionKanbanBoard from './ProductionKanbanBoard';
import ProductionKanbanEmptyState from './ProductionKanbanEmptyState';
import ProductionKanbanSummary from './ProductionKanbanSummary';

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

  return (
    <div className="space-y-4">
      <ProductionKanbanSummary
        discoveryLinkCandidateCount={discoveryLinkCandidates.length}
        productionSummary={productionSummary}
        videoCount={videos.length}
      />

      <ProductionDiscoveryLinksSection
        linkMoveStates={linkMoveStates}
        links={discoveryLinkCandidates}
        onMoveLink={moveDiscoveryLink}
        onOpenDiscoveryLinks={onOpenDiscoveryLinks}
      />

      <ProductionKanbanBoard
        columns={PRODUCTION_KANBAN_COLUMNS}
        draftRecords={draftRecords}
        getScheduleSignal={getProductionScheduleSignal}
        groupedVideos={groupedVideos}
        hasUnsavedChanges={hasUnsavedChanges}
        moveStates={moveStates}
        onMove={moveVideo}
        onSave={saveDraftRecord}
        onUpdateDraft={updateDraftRecord}
        saveStates={saveStates}
        videoUserRecords={videoUserRecords}
      />
    </div>
  );
}
