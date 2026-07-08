import { PRODUCTION_KANBAN_EMPTY_STATE } from '../constants/emptyStates';
import { PRODUCTION_KANBAN_COLUMNS } from '../constants/productionKanban';
import { getProductionScheduleSignal } from './productionSchedule';

const toArray = (items) => (Array.isArray(items) ? items : []);

const toSummaryObject = (summary) => (
  summary && typeof summary === 'object' ? summary : {}
);

const isFunction = (value) => typeof value === 'function';

export const shouldShowProductionKanbanEmptyState = ({
  discoveryLinkCandidates,
  productionSummary,
}) => {
  const summary = toSummaryObject(productionSummary);
  return (summary.videoCount || 0) === 0 && toArray(discoveryLinkCandidates).length === 0;
};

export const getProductionKanbanEmptyStateActions = ({
  onOpenDiscoveryLinks,
  onOpenHome,
  onOpenReferenceVault,
} = {}) => [
  {
    key: 'home',
    iconKey: 'home',
    label: '오늘 레이더로',
    title: '홈의 오늘 레이더로 이동합니다. 저장된 영상 기준 후보를 다시 고르는 화면이며, 이동만으로 YouTube API를 호출하지 않습니다.',
    ariaLabel: '오늘 레이더 화면 열기, 이동만으로 YouTube API 호출 없음',
    onClick: onOpenHome,
    variant: 'rose',
  },
  {
    key: 'reference-vault',
    iconKey: 'referenceVault',
    label: PRODUCTION_KANBAN_EMPTY_STATE.referenceVaultButton.label,
    title: PRODUCTION_KANBAN_EMPTY_STATE.referenceVaultButton.title,
    ariaLabel: PRODUCTION_KANBAN_EMPTY_STATE.referenceVaultButton.ariaLabel,
    onClick: onOpenReferenceVault,
    variant: 'indigo',
  },
  {
    key: 'discovery-links',
    iconKey: 'discoveryLinks',
    label: PRODUCTION_KANBAN_EMPTY_STATE.discoveryLinksButton.label,
    title: PRODUCTION_KANBAN_EMPTY_STATE.discoveryLinksButton.title,
    ariaLabel: PRODUCTION_KANBAN_EMPTY_STATE.discoveryLinksButton.ariaLabel,
    onClick: onOpenDiscoveryLinks,
    variant: 'secondary',
  },
].filter((action) => isFunction(action.onClick));

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
