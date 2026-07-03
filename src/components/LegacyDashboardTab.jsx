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
  return (
    <>
      <VideoDashboardControls
        activeSelectedChannelCount={activeSelectedChannelCount}
        checkedVideos={checkedVideos}
        copiedPrompt={copiedPrompt}
        promptCopyError={promptCopyError}
        filteredCount={filteredAndSortedVideos.length}
        filteredVideos={filteredAndSortedVideos}
        isReferenceVaultView={isReferenceVaultView}
        isScanning={isScanning}
        lengthFilter={lengthFilter}
        onCopyPrompt={() => copyPromptForVideos(videos.filter(video => checkedVideos.includes(video.videoId)))}
        onManualScan={handleManualScan}
        savedChannelCount={savedChannels.length}
        savedVideoCount={savedVideos.length}
        scannableChannelCount={scannableChannelCount}
        searchKeyword={searchKeyword}
        selectedChannelCount={selectedChannelIds.length}
        setLengthFilter={setLengthFilter}
        setSearchKeyword={setSearchKeyword}
        setShowWorkPanel={setShowWorkPanel}
        setSortType={setSortType}
        setTtoTtoMode={setTtoTtoMode}
        setViewFilter={setViewFilter}
        setViewMode={setViewMode}
        showWorkPanel={showWorkPanel}
        sortType={sortType}
        totalVideoCount={totalVideoCount}
        ttoTtoAssetCount={ttoTtoAssetCount}
        ttoTtoMode={ttoTtoMode}
        viewFilter={viewFilter}
        viewMode={viewMode}
        visibleScrapCount={visibleScrapCount}
      />

      <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 overflow-hidden flex-1 relative flex flex-col min-h-[600px]">
        <p className="px-4 pt-3 text-[10px] text-slate-500">댓글 Top 10 보기는 YouTube API로 댓글을 조회합니다. 저장된 영상 불러오기와는 별도 기능입니다.</p>
        <VideoResultsPanel
          checkedVideos={checkedVideos}
          filteredVideos={filteredAndSortedVideos}
          isProductionCandidate={isProductionCandidate}
          isVideoSaved={isVideoSaved}
          onFetchComments={fetchTopComments}
          onPromoteToProduction={promoteVideoToProduction}
          onToggleCheck={toggleCheckVideo}
          onToggleScrap={toggleScrapVideo}
          showWorkPanel={showWorkPanel}
          videos={videos}
          viewMode={viewMode}
        />
      </div>
    </>
  );
}
