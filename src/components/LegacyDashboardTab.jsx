import VideoDashboardControls from './VideoDashboardControls';
import VideoResultsPanel from './VideoResultsPanel';

export default function LegacyDashboardTab({
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
  const selectedVideos = videos.filter(video => checkedVideos.includes(video.videoId));
  const controlsProps = {
    activeSelectedChannelCount,
    checkedVideos,
    copiedPrompt,
    promptCopyError,
    filteredCount: filteredAndSortedVideos.length,
    filteredVideos: filteredAndSortedVideos,
    isReferenceVaultView,
    isScanning,
    lengthFilter,
    onCopyPrompt: () => copyPromptForVideos(selectedVideos),
    onManualScan: handleManualScan,
    savedChannelCount: savedChannels.length,
    savedVideoCount: savedVideos.length,
    scannableChannelCount,
    searchKeyword,
    selectedChannelCount: selectedChannelIds.length,
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
  };

  const resultsPanelProps = {
    checkedVideos,
    filteredVideos: filteredAndSortedVideos,
    isProductionCandidate,
    isVideoSaved,
    onFetchComments: fetchTopComments,
    onPromoteToProduction: promoteVideoToProduction,
    onToggleCheck: toggleCheckVideo,
    onToggleScrap: toggleScrapVideo,
    showWorkPanel,
    videos,
    viewMode,
  };

  return (
    <>
      <VideoDashboardControls {...controlsProps} />

      <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 overflow-hidden flex-1 relative flex flex-col min-h-[600px]">
        <p className="px-4 pt-3 text-[10px] text-slate-500">댓글 Top 10 보기는 YouTube API로 댓글을 조회합니다. 저장된 영상 불러오기와는 별도 기능입니다.</p>
        <VideoResultsPanel {...resultsPanelProps} />
      </div>
    </>
  );
}
