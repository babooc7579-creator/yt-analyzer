import { PRODUCTION_KANBAN_COLUMNS } from '../constants/productionKanban';
import { getProductionScheduleSignal } from '../utils/productionSchedule';
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
  return (
    <div className="space-y-4">
      <ProductionKanbanSummary
        discoveryLinkCandidateCount={discoveryLinkCandidates.length}
        productionSummary={productionSummary}
        videoCount={videoCount}
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
