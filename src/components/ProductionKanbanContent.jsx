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
  const summaryProps = {
    discoveryLinkCandidateCount: discoveryLinkCandidates.length,
    productionSummary,
    videoCount,
  };

  const discoveryLinksSectionProps = {
    linkMoveStates,
    links: discoveryLinkCandidates,
    onMoveLink: moveDiscoveryLink,
    onOpenDiscoveryLinks,
  };

  const boardProps = {
    columns: PRODUCTION_KANBAN_COLUMNS,
    draftRecords,
    getScheduleSignal: getProductionScheduleSignal,
    groupedVideos,
    hasUnsavedChanges,
    moveStates,
    onMove: moveVideo,
    onSave: saveDraftRecord,
    onUpdateDraft: updateDraftRecord,
    saveStates,
    videoUserRecords,
  };

  return (
    <div className="space-y-4">
      <ProductionKanbanSummary {...summaryProps} />

      <ProductionDiscoveryLinksSection {...discoveryLinksSectionProps} />

      <ProductionKanbanBoard {...boardProps} />
    </div>
  );
}
