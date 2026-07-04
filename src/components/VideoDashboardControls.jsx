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

  return (
    <>
      <VideoDashboardSourceSummary
        isReferenceVaultView={isReferenceVaultView}
        savedChannelCount={savedChannelCount}
        savedVideoCount={savedVideoCount}
        totalVideoCount={totalVideoCount}
        ttoTtoAssetCount={ttoTtoAssetCount}
        visibleScrapCount={visibleScrapCount}
      />

      <VideoToolbar
        isReferenceVaultView={isReferenceVaultView}
        filteredCount={filteredCount}
        filteredVideoUrlList={filteredVideoUrlList}
        totalCount={totalVideoCount}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        viewFilter={viewFilter}
        setViewFilter={setViewFilter}
        lengthFilter={lengthFilter}
        setLengthFilter={setLengthFilter}
        sortType={sortType}
        setSortType={setSortType}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showWorkPanel={showWorkPanel}
        setShowWorkPanel={setShowWorkPanel}
        isScanning={isScanning}
        selectedChannelCount={selectedChannelCount}
        activeSelectedChannelCount={activeSelectedChannelCount}
        scannableChannelCount={scannableChannelCount}
        handleManualScan={onManualScan}
        ttoTtoMode={ttoTtoMode}
        setTtoTtoMode={setTtoTtoMode}
      />

      <SelectedVideosActionBar
        selectedCount={checkedVideos.length}
        copiedPrompt={copiedPrompt}
        promptCopyError={promptCopyError}
        onCopyPrompt={onCopyPrompt}
      />
    </>
  );
}
