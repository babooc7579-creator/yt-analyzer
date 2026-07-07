import { PRODUCTION_KANBAN_COLUMNS } from '../constants/productionKanban';
import { getProductionScheduleSignal } from './productionSchedule';

const toArray = (items) => (Array.isArray(items) ? items : []);

const toSummaryObject = (summary) => (
  summary && typeof summary === 'object' ? summary : {}
);

export const shouldShowProductionKanbanEmptyState = ({
  discoveryLinkCandidates,
  productionSummary,
}) => {
  const summary = toSummaryObject(productionSummary);
  return (summary.videoCount || 0) === 0 && toArray(discoveryLinkCandidates).length === 0;
};

export const getProductionKanbanContentProps = ({
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
  videoUserRecords,
}) => {
  const summary = toSummaryObject(productionSummary);

  return {
    discoveryLinkCandidates: toArray(discoveryLinkCandidates),
    draftRecords,
    groupedVideos,
    hasUnsavedChanges,
    linkMoveStates,
    moveDiscoveryLink,
    moveStates,
    moveVideo,
    onOpenDiscoveryLinks,
    productionSummary: summary,
    saveDraftRecord,
    saveStates,
    updateDraftRecord,
    videoCount: summary.videoCount || 0,
    videoUserRecords,
  };
};

export const getProductionKanbanContentChildProps = ({
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
}) => {
  const discoveryLinkCandidateList = toArray(discoveryLinkCandidates);

  return {
    boardProps: {
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
    },
    discoveryLinksSectionProps: {
      linkMoveStates,
      links: discoveryLinkCandidateList,
      onMoveLink: moveDiscoveryLink,
      onOpenDiscoveryLinks,
    },
    summaryProps: {
      discoveryLinkCandidateCount: discoveryLinkCandidateList.length,
      productionSummary,
      videoCount,
    },
  };
};
