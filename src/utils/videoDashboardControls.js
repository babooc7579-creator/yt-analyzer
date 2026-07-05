import { formatNumberedUrlList, getYouTubeVideoUrl } from './urls';

const getVideoList = (videos) => (
  Array.isArray(videos) ? videos.filter(video => video && typeof video === 'object') : []
);

export const getFilteredVideoUrlList = (filteredVideos = []) => formatNumberedUrlList(
  getVideoList(filteredVideos)
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
  const filteredVideoList = getVideoList(filteredVideos);
  const filteredVideoUrlList = getFilteredVideoUrlList(filteredVideoList);

  return {
    selectedVideosActionProps: {
      selectedCount: getVideoList(checkedVideos).length,
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
