import { guardProductionSidebarNavigation } from './productionNavigation';

const toArray = (items) => (Array.isArray(items) ? items : []);

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
  discoveryCandidateCount,
  savedVideoCount,
  selectedChannelCount,
  videoCount,
}) => [
  {
    value: channelCount,
    label: '채널',
    description: 'Cloud 채널 목록에 저장된 채널 수입니다.',
  },
  {
    value: videoCount,
    label: '불러온 영상',
    description: '현재 화면에 불러온 저장 영상 수입니다. 새 YouTube API 호출 수가 아닙니다.',
  },
  {
    value: selectedChannelCount,
    label: '선택 채널',
    description: '저장 영상 조회나 새 영상 수집 대상으로 체크한 채널 수입니다.',
  },
  {
    value: savedVideoCount,
    label: '스크랩 영상',
    description: 'Cloud 스크랩북에 보관 중인 영상 수입니다.',
  },
  {
    value: discoveryCandidateCount,
    label: '링크 후보',
    description: 'Cloud 발견함에서 제작 후보로 표시한 링크 수입니다.',
  },
];

export const getWorkspaceTabsViewProps = ({ savedVideoCount }) => ({
  dashboardTab: {
    ariaLabel: '분석 대시보드 탭 열기, 탭 이동만으로 YouTube API 호출 없음',
    label: '분석 대시보드',
    title: '현재 불러온 저장 영상 분석 대시보드 보기. 탭 이동만으로 YouTube API를 새로 호출하지 않습니다.',
  },
  scrapbookTab: {
    ariaLabel: `영구 스크랩북 탭 열기, 보관 영상 ${savedVideoCount}개, 탭 이동만으로 YouTube API 호출 없음`,
    label: '영구 스크랩북',
    title: `Cloud 스크랩북 보기 - 보관 영상 ${savedVideoCount}개. 탭 이동만으로 YouTube API를 새로 호출하지 않습니다.`,
  },
});

export function buildLayoutProps({
  activeCreatorItem,
  addChannelNote,
  changeNoteText,
  closeNotesModal,
  closeTopCommentsModal,
  commentModal,
  creatorView,
  discoveryCandidateCount,
  error,
  hasUnsavedProductionDrafts,
  notesModal,
  onConfirmUnsavedNavigation,
  openCreatorView,
  savedChannels,
  savedVideos,
  setError,
  selectedChannelIds,
  syncWarnings,
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

  return {
    activeCreatorItem,
    channelCount: channelList.length,
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
    onOpenCreatorView: hasUnsavedProductionDrafts
      ? guardProductionSidebarNavigation({
        activeView: creatorView,
        confirmNavigation,
        hasUnsavedDrafts: true,
        onNavigate: openCreatorView,
      })
      : openCreatorView,
    progressMessage: progressMsg,
    savedVideoCount: savedVideoList.length,
    selectedChannelCount: selectedChannels.length,
    syncWarnings,
    videoCount: videoList.length,
  };
}
