import { formatNumberedUrlList, getYouTubeVideoUrl } from './urls';

export const getFilteredVideoUrlList = (filteredVideos = []) => formatNumberedUrlList(
  filteredVideos
    .filter((video) => video.videoId)
    .map((video) => [video.title || '제목 없는 영상', getYouTubeVideoUrl(video.videoId)])
);

export const getVideoDashboardControlsViewProps = ({
  activeSelectedChannelCount,
  checkedVideos,
  copiedPrompt,
  promptCopyError,
  filteredCount,
  filteredVideos = [],
  isReferenceVaultView,
  isScanning,
  lengthFilter,
  onCopyPrompt,
  onManualScan,
  savedChannelCount,
  savedVideoCount,
  scannableChannelCount,
  searchKeyword,
  selectedChannelCount,
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
}) => {
  const filteredVideoUrlList = getFilteredVideoUrlList(filteredVideos);

  return {
    selectedVideosActionProps: {
      selectedCount: checkedVideos.length,
      copiedPrompt,
      promptCopyError,
      onCopyPrompt,
    },
    sourceSummaryProps: {
      isReferenceVaultView,
      savedChannelCount,
      savedVideoCount,
      totalVideoCount,
      ttoTtoAssetCount,
      visibleScrapCount,
    },
    toolbarProps: {
      activeSelectedChannelCount,
      filteredCount,
      filteredVideoUrlList,
      handleManualScan: onManualScan,
      isReferenceVaultView,
      isScanning,
      lengthFilter,
      scannableChannelCount,
      searchKeyword,
      selectedChannelCount,
      setLengthFilter,
      setSearchKeyword,
      setShowWorkPanel,
      setSortType,
      setTtoTtoMode,
      setViewFilter,
      setViewMode,
      showWorkPanel,
      sortType,
      totalCount: totalVideoCount,
      ttoTtoMode,
      viewFilter,
      viewMode,
    },
  };
};
