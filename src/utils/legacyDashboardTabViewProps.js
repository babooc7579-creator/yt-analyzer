const toArray = (items) => (Array.isArray(items) ? items : []);

const toVideoList = (videos) => (
  toArray(videos).filter(video => video && typeof video === 'object')
);

export const LEGACY_DASHBOARD_COMMENT_NOTICE = '댓글 Top 10 보기는 YouTube API로 댓글을 조회합니다. 저장된 영상 불러오기와는 별도 기능입니다.';

export function getLegacyDashboardTabViewProps({
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
}) {
  const checkedVideoIds = toArray(checkedVideos);
  const filteredVideos = toVideoList(filteredAndSortedVideos);
  const savedChannelList = toArray(savedChannels);
  const savedVideoList = toVideoList(savedVideos);
  const selectedChannels = toArray(selectedChannelIds);
  const videoList = toVideoList(videos);
  const selectedVideos = videoList.filter(video => checkedVideoIds.includes(video.videoId));

  return {
    commentApiNotice: LEGACY_DASHBOARD_COMMENT_NOTICE,
    controlsProps: {
      activeSelectedChannelCount,
      checkedVideos: checkedVideoIds,
      copiedPrompt,
      promptCopyError,
      filteredCount: filteredVideos.length,
      filteredVideos,
      isReferenceVaultView,
      isScanning,
      lengthFilter,
      onCopyPrompt: () => copyPromptForVideos(selectedVideos),
      onManualScan: handleManualScan,
      savedChannelCount: savedChannelList.length,
      savedVideoCount: savedVideoList.length,
      scannableChannelCount,
      searchKeyword,
      selectedChannelCount: selectedChannels.length,
      setLengthFilter,
      setSearchKeyword,
      setShowWorkPanel,
      setSortType,
      setTtoTtoMode,
      setViewFilter,
      setViewMode,
      showWorkPanel,
      sortType,
      totalVideoCount,
      ttoTtoAssetCount,
      ttoTtoMode,
      viewFilter,
      viewMode,
      visibleScrapCount,
    },
    resultsPanelProps: {
      checkedVideos: checkedVideoIds,
      filteredVideos,
      isProductionCandidate,
      isVideoSaved,
      onFetchComments: fetchTopComments,
      onPromoteToProduction: promoteVideoToProduction,
      onToggleCheck: toggleCheckVideo,
      onToggleScrap: toggleScrapVideo,
      showWorkPanel,
      videos: videoList,
      viewMode,
    },
  };
}
