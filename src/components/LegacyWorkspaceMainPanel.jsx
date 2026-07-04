import LegacyDashboardTab from './LegacyDashboardTab';
import LegacyVaultTab from './LegacyVaultTab';
import WorkspaceTabs from './WorkspaceTabs';

export default function LegacyWorkspaceMainPanel({
  activeSelectedChannelCount,
  activeTab,
  checkedVideos,
  copiedPrompt,
  copyPromptForVideos,
  creatorView,
  discoveryLinks,
  fetchTopComments,
  filteredAndSortedVideos,
  handleManualScan,
  isProductionCandidate,
  isReferenceVaultView,
  isScanning,
  isVideoSaved,
  lengthFilter,
  markRadarVideoStatus,
  openCreatorView,
  promoteVideoToProduction,
  promptCopyError,
  savedChannels,
  savedVideos,
  scannableChannelCount,
  searchKeyword,
  selectedChannelIds,
  setActiveTab,
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
  const dashboardTabProps = {
    activeSelectedChannelCount,
    checkedVideos,
    copiedPrompt,
    copyPromptForVideos,
    fetchTopComments,
    filteredAndSortedVideos,
    handleManualScan,
    isProductionCandidate,
    isReferenceVaultView,
    isScanning,
    isVideoSaved,
    lengthFilter,
    promoteVideoToProduction,
    promptCopyError,
    savedChannels,
    savedVideos,
    scannableChannelCount,
    searchKeyword,
    selectedChannelIds,
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
    videos,
    viewFilter,
    viewMode,
    visibleScrapCount,
  };

  const vaultTabProps = {
    creatorView,
    discoveryLinks,
    copiedPrompt,
    copyPromptForVideos,
    fetchTopComments,
    markRadarVideoStatus,
    openCreatorView,
    promptCopyError,
    savedVideos,
    toggleScrapVideo,
    updateDiscoveryLink,
    updateVideoUserRecord,
    videoUserRecords,
  };

  return (
    <div className="flex flex-col h-full space-y-4 min-w-0">
      <WorkspaceTabs
        activeTab={activeTab}
        savedVideoCount={savedVideos.length}
        onSelectTab={setActiveTab}
      />

      {activeTab === 'dashboard' ? (
        <LegacyDashboardTab {...dashboardTabProps} />
      ) : (
        <LegacyVaultTab {...vaultTabProps} />
      )}
    </div>
  );
}
