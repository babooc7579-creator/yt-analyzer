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

export const getProductionKanbanNextActions = ({
  discoveryLinkCandidateCount = 0,
  onOpenDiscoveryLinks,
  onOpenReferenceVault,
  videoCount = 0,
} = {}) => [
  {
    key: 'reference-vault',
    iconKey: 'referenceVault',
    label: '저장 영상 더 보기',
    title: `저장 영상 탐색 화면을 엽니다. 현재 제작 후보 영상 ${videoCount}개와 별도로 Cloud DB에 저장된 영상을 조회하며 YouTube API를 새로 호출하지 않습니다.`,
    ariaLabel: '저장 영상 탐색 화면 열기, Cloud DB 조회이며 YouTube API 호출 없음',
    onClick: onOpenReferenceVault,
    variant: 'indigo',
  },
  {
    key: 'discovery-links',
    iconKey: 'discoveryLinks',
    label: '발견함 링크 정리',
    title: `발견함을 열어 링크 후보 ${discoveryLinkCandidateCount}개를 확인하거나 새 링크를 수동 저장합니다. 외부 자동 수집이나 다운로드는 실행하지 않습니다.`,
    ariaLabel: '발견함 열기, 외부 자동 수집이나 다운로드 없음',
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
  onOpenReferenceVault,
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
    onOpenReferenceVault,
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
  onOpenReferenceVault,
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
    nextActionsProps: {
      actions: getProductionKanbanNextActions({
        discoveryLinkCandidateCount: discoveryLinkCandidateList.length,
        onOpenDiscoveryLinks,
        onOpenReferenceVault,
        videoCount,
      }),
    },
    summaryProps: {
      discoveryLinkCandidateCount: discoveryLinkCandidateList.length,
      productionSummary,
      videoCount,
    },
  };
};
