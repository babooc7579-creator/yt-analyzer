import ReferenceVaultSummary from './ReferenceVaultSummary';
import SelectedVideosActionBar from './SelectedVideosActionBar';
import StoredVideoGuide from './StoredVideoGuide';
import VideoToolbar from './VideoToolbar';
import { getYouTubeVideoUrl } from '../utils/urls';

export default function VideoDashboardControls({
  activeSelectedChannelCount,
  checkedVideos,
  copiedPrompt,
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
  const filteredVideoUrlList = filteredVideos
    .filter((video) => video.videoId)
    .map((video, index) => `${index + 1}. ${video.title || '제목 없는 영상'}\n${getYouTubeVideoUrl(video.videoId)}`)
    .join('\n\n');

  return (
    <>
      {isReferenceVaultView ? (
        <ReferenceVaultSummary
          videoCount={totalVideoCount}
          channelCount={savedChannelCount}
          scrapCount={savedVideoCount}
          visibleScrapCount={visibleScrapCount}
          ttoTtoCount={ttoTtoAssetCount}
        />
      ) : (
        <StoredVideoGuide />
      )}

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
        onCopyPrompt={onCopyPrompt}
      />
    </>
  );
}
