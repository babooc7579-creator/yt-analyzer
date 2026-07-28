import { PRODUCTION_UNSAVED_NAVIGATION_MESSAGE } from './productionNavigation';
import { guardUnsavedSidebarNavigation } from './unsavedNavigation';
import { WORK_TOOL_UNSAVED_NAVIGATION_MESSAGE } from './workToolSettings';

const toArray = (items) => (Array.isArray(items) ? items : []);
const isFunction = (value) => typeof value === 'function';

export const getSyncWarningRetryActions = ({
  retryScrapbookSync,
  retryVideoUserRecordsSync,
  scrapbookSyncWarning,
  videoRecordsSyncWarning,
} = {}) => ([
  videoRecordsSyncWarning && isFunction(retryVideoUserRecordsSync) ? {
    key: 'video-records',
    label: '영상 판단 기록 다시 확인',
    pendingLabel: '영상 판단 기록 확인 중...',
    successMessage: '영상 판단 기록을 온라인 저장소(Azure DB)에서 다시 확인했습니다.',
    failureMessage: '영상 판단 기록을 아직 확인하지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
    title: '온라인 저장소(Azure DB)의 영상 판단 기록을 다시 조회합니다. 기존 기록을 저장·삭제하거나 YouTube API를 호출하지 않습니다.',
    onClick: retryVideoUserRecordsSync,
  } : null,
  scrapbookSyncWarning && isFunction(retryScrapbookSync) ? {
    key: 'scrapbook',
    label: '소재 보관함 다시 확인',
    pendingLabel: '소재 보관함 확인 중...',
    successMessage: '소재 보관함을 온라인 저장소(Azure DB)에서 다시 확인했습니다.',
    failureMessage: '소재 보관함을 아직 확인하지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
    title: '온라인 저장소(Azure DB)의 소재 보관함을 다시 조회합니다. 보관 상태를 변경하거나 YouTube API를 호출하지 않습니다.',
    onClick: retryScrapbookSync,
  } : null,
]).filter(Boolean);

export const getCreatorSidebarHeaderViewProps = () => ({
  brandLabel: '타임머신 CRM',
  description: '유튜브 레퍼런스를 발굴하고 제작 자산으로 축적하는 지휘실입니다.',
  title: 'Creator OS',
});

export const getCreatorSidebarItemViewProps = ({ item }) => {
  const isComingSoon = item.status === 'soon';

  return {
    actionLabel: isComingSoon ? `${item.label} 준비중 안내 보기, API 호출이나 DB 변경 없음` : `${item.label} 화면 열기`,
    isComingSoon,
    statusLabel: '준비중',
  };
};

const filterSidebarSections = (sections, predicate) => (
  toArray(sections)
    .map((section) => ({
      ...section,
      items: toArray(section?.items).filter(predicate),
    }))
    .filter((section) => section.items.length > 0)
);

export const getCreatorSidebarNavigationGroups = (sections) => {
  const liveSections = filterSidebarSections(
    sections,
    (item) => item?.status !== 'soon',
  );
  const roadmapSections = filterSidebarSections(
    sections,
    (item) => item?.status === 'soon',
  );

  return {
    liveItemCount: liveSections.reduce((total, section) => total + section.items.length, 0),
    liveSections,
    roadmapItemCount: roadmapSections.reduce((total, section) => total + section.items.length, 0),
    roadmapSections,
  };
};

export const getCreatorSidebarRoadmapViewProps = ({
  isOpen,
  roadmapItemCount,
}) => ({
  ariaLabel: `향후 기능 ${roadmapItemCount}개 ${isOpen ? '접기' : '펼치기'}, 화면 표시만 변경하며 API 호출이나 데이터 변경 없음`,
  countLabel: `${roadmapItemCount}개`,
  description: '계획된 기능',
  title: '향후 기능',
});

export const getCreatorWorkspaceHeaderStatCards = ({
  channelCount,
  channelsLoading = false,
  discoveryCandidateCount,
  savedVideoCount,
  selectedChannelCount,
  videoCount,
}) => [
  {
    value: channelsLoading ? '조회 중' : channelCount,
    label: '채널',
    description: channelsLoading
      ? '온라인 저장소(Azure DB)에서 채널 목록을 조회하고 있습니다. YouTube API 호출은 없습니다.'
      : '온라인 저장소(Azure DB)에 등록된 채널 수입니다.',
  },
  {
    value: videoCount,
    label: '불러온 영상',
    description: '현재 화면에 불러온 수집 영상 정보 수입니다. 새 YouTube API 호출 수가 아닙니다.',
  },
  {
    value: selectedChannelCount,
    label: '선택 채널',
    description: '수집 영상 조회나 새 영상 수집 대상으로 체크한 채널 수입니다.',
  },
  {
    value: savedVideoCount,
    label: '보관 소재',
    description: '온라인 저장소(Azure DB)의 소재 보관함에 보관 중인 영상 수입니다.',
  },
  {
    value: discoveryCandidateCount,
    label: '링크 후보',
    description: '온라인 발견함(Azure DB)에서 제작 후보로 표시한 링크 수입니다.',
  },
];

export const getWorkspaceTabsViewProps = ({ creatorView, savedVideoCount }) => {
  const isProductionView = creatorView === 'studio-candidates';

  return {
    dashboardTab: {
      ariaLabel: '수집 영상 목록 탭 열기, 탭 이동만으로 YouTube API 호출 없음',
      label: '수집 영상 목록',
      title: '현재 불러온 수집 영상 정보를 검색·필터·정렬하는 화면입니다. 탭 이동만으로 영상 조회나 YouTube API 호출을 실행하지 않습니다.',
    },
    scrapbookTab: isProductionView
      ? {
        ariaLabel: '제작 후보함 탭, 저장된 제작 후보 조회이며 YouTube API 호출 없음',
        countLabel: null,
        label: '제작 후보함',
        title: '제작 후보로 표시한 영상과 발견 링크를 확인하는 화면입니다. 새 YouTube API 호출이나 외부 수집은 실행하지 않습니다.',
      }
      : {
        ariaLabel: `소재 보관함 탭 열기, 보관 영상 ${savedVideoCount}개, 탭 이동만으로 YouTube API 호출 없음`,
        countLabel: savedVideoCount,
        label: '소재 보관함',
        title: `온라인 저장소(Azure DB)의 소재 보관함 보기 - 보관 영상 ${savedVideoCount}개. 탭 이동만으로 YouTube API를 새로 호출하지 않습니다.`,
      },
  };
};

export function buildLayoutProps({
  activeCreatorItem,
  addChannelNote,
  changeNoteText,
  closeNotesModal,
  closeTopCommentsModal,
  commentModal,
  creatorView,
  channelsLoading,
  discoveryCandidateCount,
  error,
  hasUnsavedProductionDrafts,
  hasUnsavedWorkToolSettings,
  notesModal,
  onConfirmUnsavedNavigation,
  openCreatorView,
  retryScrapbookSync,
  retryVideoUserRecordsSync,
  scrapbookSyncWarning,
  savedChannels,
  savedVideos,
  setError,
  selectedChannelIds,
  syncWarnings,
  videoRecordsSyncWarning,
  videos,
  progressMsg,
}) {
  const channelList = toArray(savedChannels);
  const savedVideoList = toArray(savedVideos);
  const selectedChannels = toArray(selectedChannelIds);
  const videoList = toArray(videos);
  const confirmNavigation = (message) => {
    if (typeof onConfirmUnsavedNavigation === 'function') {
      return onConfirmUnsavedNavigation(message);
    }
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      return window.confirm(message);
    }
    return false;
  };
  const hasUnsavedSidebarChanges = Boolean(
    hasUnsavedProductionDrafts || hasUnsavedWorkToolSettings
  );
  const unsavedNavigationMessage = hasUnsavedProductionDrafts && hasUnsavedWorkToolSettings
    ? [
      '온라인 저장소(Azure DB)에 저장하지 않은 제작안과 업무 도구 설정이 있습니다.',
      '저장하지 않고 다른 화면으로 이동할까요?',
    ].join('\n')
    : hasUnsavedProductionDrafts
      ? PRODUCTION_UNSAVED_NAVIGATION_MESSAGE
      : WORK_TOOL_UNSAVED_NAVIGATION_MESSAGE;

  return {
    activeCreatorItem,
    channelCount: channelList.length,
    channelsLoading: Boolean(channelsLoading),
    commentModal,
    creatorView,
    discoveryCandidateCount,
    error,
    notesModal,
    onAddNote: addChannelNote,
    onChangeNoteText: changeNoteText,
    onCloseNotes: closeNotesModal,
    onCloseTopComments: closeTopCommentsModal,
    onClearError: () => setError?.(''),
    onOpenCreatorView: hasUnsavedSidebarChanges
      ? guardUnsavedSidebarNavigation({
        activeView: creatorView,
        confirmNavigation,
        hasUnsavedChanges: true,
        message: unsavedNavigationMessage,
        onNavigate: openCreatorView,
      })
      : openCreatorView,
    progressMessage: progressMsg,
    savedVideoCount: savedVideoList.length,
    selectedChannelCount: selectedChannels.length,
    syncWarnings,
    syncWarningActions: getSyncWarningRetryActions({
      retryScrapbookSync,
      retryVideoUserRecordsSync,
      scrapbookSyncWarning,
      videoRecordsSyncWarning,
    }),
    videoCount: videoList.length,
  };
}
