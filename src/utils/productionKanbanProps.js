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
  onOpenScriptBoard,
  onOpenUploadCalendar,
  videoCount = 0,
} = {}) => [
  {
    key: 'script-board',
    iconKey: 'scriptBoard',
    label: '대본 보드 열기',
    title: '제작 후보의 제목, 구성 메모, 목표 날짜를 정리하는 대본 보드로 이동합니다. 이동만으로 Cloud 저장이나 YouTube API 호출은 실행되지 않습니다.',
    ariaLabel: '대본 보드 열기, 화면 이동이며 Cloud 저장 및 YouTube API 호출 없음',
    onClick: onOpenScriptBoard,
    variant: 'indigo',
  },
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
    key: 'upload-calendar',
    iconKey: 'uploadCalendar',
    label: '업로드 일정 보기',
    title: '업로드 캘린더를 열어 Cloud에 저장된 목표 날짜를 확인합니다. 화면 이동과 달력 조회만으로 YouTube API를 호출하지 않습니다.',
    ariaLabel: '업로드 캘린더 열기, Cloud 저장 일정 조회이며 YouTube API 호출 없음',
    onClick: onOpenUploadCalendar,
    variant: 'amber',
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
  onFilterModeChange,
  overallDiscoveryLinkCandidateCount,
  overallProductionSummary,
  productionSummary,
  saveDraftRecord,
  saveStates,
  updateDraftRecord,
  updateVideoFocus,
  videoUserRecords,
}) => {
  const summary = toSummaryObject(productionSummary);

  return {
    activeFilterMode,
    discoveryLinkCandidates: toArray(discoveryLinkCandidates),
    draftRecords,
    focusVideos: toArray(focusVideos),
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
    onFilterModeChange,
    overallDiscoveryLinkCandidateCount: Number.isFinite(overallDiscoveryLinkCandidateCount)
      ? overallDiscoveryLinkCandidateCount
      : toArray(discoveryLinkCandidates).length,
    overallProductionSummary: toSummaryObject(overallProductionSummary || summary),
    productionSummary: summary,
    saveDraftRecord,
    saveStates,
    updateDraftRecord,
    updateVideoFocus,
    videoCount: summary.videoCount || 0,
    videoUserRecords,
  };
};

export const getProductionKanbanContentChildProps = ({
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
  onFilterModeChange,
  overallDiscoveryLinkCandidateCount,
  overallProductionSummary,
  productionSummary,
  saveDraftRecord,
  saveStates,
  updateDraftRecord,
  updateVideoFocus,
  videoCount,
  videoUserRecords,
}) => {
  const discoveryLinkCandidateList = toArray(discoveryLinkCandidates);
  const focusVideoList = toArray(focusVideos);
  const summaryDiscoveryLinkCandidateCount = Number.isFinite(overallDiscoveryLinkCandidateCount)
    ? overallDiscoveryLinkCandidateCount
    : discoveryLinkCandidateList.length;
  const summaryProductionModel = toSummaryObject(overallProductionSummary || productionSummary);

  return {
    boardProps: {
      columns: PRODUCTION_KANBAN_COLUMNS,
      draftRecords,
      getScheduleSignal: getProductionScheduleSignal,
      groupedVideos,
      hasUnsavedChanges,
      moveStates,
      onFocus: updateVideoFocus,
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
    focusSectionProps: {
      draftRecords,
      getScheduleSignal: getProductionScheduleSignal,
      hasUnsavedChanges,
      moveStates,
      onFocus: updateVideoFocus,
      onMove: moveVideo,
      onOpenUploadCalendar,
      onSave: saveDraftRecord,
      onUpdateDraft: updateDraftRecord,
      saveStates,
      videoUserRecords,
      videos: focusVideoList,
    },
    nextActionsProps: {
      actions: getProductionKanbanNextActions({
        discoveryLinkCandidateCount: discoveryLinkCandidateList.length,
        onOpenDiscoveryLinks,
        onOpenReferenceVault,
        onOpenScriptBoard,
        onOpenUploadCalendar,
        videoCount,
      }),
    },
    summaryProps: {
      activeFilterMode,
      discoveryLinkCandidateCount: summaryDiscoveryLinkCandidateCount,
      onFilterModeChange,
      onOpenUploadCalendar,
      productionSummary: summaryProductionModel,
      videoCount: summaryProductionModel.videoCount || videoCount,
    },
  };
};
