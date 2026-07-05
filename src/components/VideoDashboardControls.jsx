import SelectedVideosActionBar from './SelectedVideosActionBar';
import VideoDashboardSourceSummary from './VideoDashboardSourceSummary';
import VideoToolbar from './VideoToolbar';
import { getVideoDashboardControlsViewProps } from '../utils/videoDashboardControls';

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
  const {
    selectedVideosActionProps,
    sourceSummaryProps,
    toolbarProps,
  } = getVideoDashboardControlsViewProps({
    activeSelectedChannelCount,
    checkedVideos,
    copiedPrompt,
    promptCopyError,
    filteredCount,
    filteredVideos,
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
  });

  return (
    <>
      <VideoDashboardSourceSummary {...sourceSummaryProps} />

      <VideoToolbar {...toolbarProps} />

      <SelectedVideosActionBar {...selectedVideosActionProps} />
    </>
  );
}
