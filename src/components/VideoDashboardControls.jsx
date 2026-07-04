import SelectedVideosActionBar from './SelectedVideosActionBar';
import VideoDashboardSourceSummary from './VideoDashboardSourceSummary';
import VideoToolbar from './VideoToolbar';
import { formatNumberedUrlList, getYouTubeVideoUrl } from '../utils/urls';

export default function VideoDashboardControls({
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
}) {
  const filteredVideoUrlList = formatNumberedUrlList(
    filteredVideos
      .filter((video) => video.videoId)
      .map((video) => [video.title || '제목 없는 영상', getYouTubeVideoUrl(video.videoId)])
  );

  const sourceSummaryProps = {
    isReferenceVaultView,
    savedChannelCount,
    savedVideoCount,
    totalVideoCount,
    ttoTtoAssetCount,
    visibleScrapCount,
  };

  const toolbarProps = {
    isReferenceVaultView,
    filteredCount,
    filteredVideoUrlList,
    totalCount: totalVideoCount,
    searchKeyword,
    setSearchKeyword,
    viewFilter,
    setViewFilter,
    lengthFilter,
    setLengthFilter,
    sortType,
    setSortType,
    viewMode,
    setViewMode,
    showWorkPanel,
    setShowWorkPanel,
    isScanning,
    selectedChannelCount,
    activeSelectedChannelCount,
    scannableChannelCount,
    handleManualScan: onManualScan,
    ttoTtoMode,
    setTtoTtoMode,
  };

  const selectedVideosActionProps = {
    selectedCount: checkedVideos.length,
    copiedPrompt,
    promptCopyError,
    onCopyPrompt,
  };

  return (
    <>
      <VideoDashboardSourceSummary {...sourceSummaryProps} />

      <VideoToolbar {...toolbarProps} />

      <SelectedVideosActionBar {...selectedVideosActionProps} />
    </>
  );
}
