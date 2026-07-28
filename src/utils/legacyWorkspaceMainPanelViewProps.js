import { guardProductionTabNavigation } from './productionNavigation';

const toArray = (items) => (Array.isArray(items) ? items : []);

const toVideoList = (videos) => (
  toArray(videos).filter(video => video && typeof video === 'object')
);

export const getWorkspaceTabTargetView = ({ creatorView, nextTab }) => {
  if (nextTab === 'dashboard') return 'vault-videos';
  if (creatorView === 'studio-candidates') return 'studio-candidates';
  return 'studio-scrapbook';
};

export function getLegacyWorkspaceMainPanelViewProps({
  activeSelectedChannelCount,
  activeTab,
  checkedVideos,
  clearCheckedVideos,
  copiedPrompt,
  copyPromptForVideos,
  creatorView,
  creatorViewIntent,
  discoveryLinks,
  fetchTopComments,
  filteredAndSortedVideos,
  handleManualScan,
  hasUnsavedProductionDrafts,
  isProductionCandidate,
  isReferenceVaultView,
  isScanning,
  isVideoSaved,
  lengthFilter,
  markRadarVideoStatus,
  openCreatorView,
  operationStage,
  onConfirmUnsavedNavigation,
  promoteVideoToProduction,
  promptCopyError,
  savedChannels,
  savedVideos,
  scannableChannelCount,
  searchKeyword,
  selectedChannelIds,
  setActiveTab,
  setHasUnsavedProductionDrafts,
  setLengthFilter,
  setSearchKeyword,
  setShowWorkPanel,
  setSortType,
  setTtoTtoMode,
  setViewFilter,
  setViewMode,
  showWorkPanel,
  sortType,
  toggleCheckVideo,
  toggleScrapVideo,
  totalVideoCount,
  ttoTtoAssetCount,
  ttoTtoMode,
  updateDiscoveryLink,
  updateVideoUserRecord,
  videoUserRecords,
  videos,
  viewFilter,
  viewMode,
  visibleScrapCount,
}) {
  const checkedVideoIds = toArray(checkedVideos);
  const filteredVideos = toVideoList(filteredAndSortedVideos);
  const savedChannelList = toArray(savedChannels);
  const savedVideoList = toVideoList(savedVideos);
  const selectedChannels = toArray(selectedChannelIds);
  const videoList = toVideoList(videos);
  const confirmNavigation = (message) => {
    if (typeof onConfirmUnsavedNavigation === 'function') {
      return onConfirmUnsavedNavigation(message);
    }
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      return window.confirm(message);
    }
    return false;
  };
  const selectWorkspaceTab = (nextTab) => {
    if (nextTab === activeTab) return false;
    if (typeof openCreatorView === 'function') {
      return openCreatorView({
        id: getWorkspaceTabTargetView({ creatorView, nextTab }),
      });
    }
    return setActiveTab?.(nextTab);
  };
  const onSelectWorkspaceTab = hasUnsavedProductionDrafts
    ? guardProductionTabNavigation({
      activeTab,
      confirmNavigation,
      hasUnsavedDrafts: true,
      onSelectTab: selectWorkspaceTab,
    })
    : selectWorkspaceTab;

  return {
    activeTab,
    operationStage,
    dashboardTabProps: {
      activeSelectedChannelCount,
      checkedVideos: checkedVideoIds,
      clearCheckedVideos,
      copiedPrompt,
      copyPromptForVideos,
      fetchTopComments,
      filteredAndSortedVideos: filteredVideos,
      handleManualScan,
      isProductionCandidate,
      isReferenceVaultView,
      isScanning,
      isVideoSaved,
      lengthFilter,
      openCreatorView,
      promoteVideoToProduction,
      promptCopyError,
      savedChannels: savedChannelList,
      savedVideos: savedVideoList,
      scannableChannelCount,
      searchKeyword,
      selectedChannelIds: selectedChannels,
      setLengthFilter,
      setSearchKeyword,
      setShowWorkPanel,
      setSortType,
      setTtoTtoMode,
      setViewFilter,
      setViewMode,
      showWorkPanel,
      sortType,
      toggleCheckVideo,
      toggleScrapVideo,
      totalVideoCount,
      ttoTtoAssetCount,
      ttoTtoMode,
      videos: videoList,
      viewFilter,
      viewMode,
      visibleScrapCount,
    },
    vaultTabProps: {
      creatorView,
      creatorViewIntent,
      discoveryLinks,
      copiedPrompt,
      copyPromptForVideos,
      fetchTopComments,
      markRadarVideoStatus,
      openCreatorView,
      promptCopyError,
      savedVideos: savedVideoList,
      setHasUnsavedProductionDrafts,
      toggleScrapVideo,
      updateDiscoveryLink,
      updateVideoUserRecord,
      videoUserRecords,
    },
    workspaceTabsProps: {
      activeTab,
      creatorView,
      onSelectTab: onSelectWorkspaceTab,
      savedVideoCount: savedVideoList.length,
    },
  };
}
