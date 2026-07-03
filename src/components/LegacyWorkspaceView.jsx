import { getChannelScanDisplay } from '../utils/channelScanDisplay';
import HiddenLegacyAside from './HiddenLegacyAside';
import LegacyChannelPanel from './LegacyChannelPanel';
import ScrapbookWorkspace from './ScrapbookWorkspace';
import VideoDashboardControls from './VideoDashboardControls';
import VideoResultsPanel from './VideoResultsPanel';
import WorkspaceTabs from './WorkspaceTabs';

export default function LegacyWorkspaceView({
  activeSelectedChannelCount,
  activeTab,
  addMode,
  apiKey,
  bulkInput,
  bulkLoading,
  bulkResult,
  cancelChannelPreview,
  cancelRenameCategory,
  categories,
  channelPreview,
  channelsLoading,
  checkedVideos,
  cloudOnlyTags,
  confirmRenameCategory,
  copiedPrompt,
  copyPromptForVideos,
  creatorView,
  deleteChannel,
  discoveryLinks,
  error,
  fetchTopComments,
  filteredAndSortedVideos,
  getScannableChannelCount,
  handleBulkAdd,
  handleManualScan,
  handlePreviewChannel,
  handleSaveChannel,
  handleTagScan,
  isEditingCategory,
  isProductionCandidate,
  isReferenceVaultView,
  isScanning,
  isVideoSaved,
  lengthFilter,
  loadStoredVideosForSelectedChannels,
  loading,
  markRadarVideoStatus,
  newCategoryName,
  newChannelInput,
  newChannelLang,
  newChannelNote,
  newChannelTags,
  openCreatorView,
  openNotesModal,
  previewLoading,
  progressMsg,
  promoteVideoToProduction,
  renameLoading,
  renameValue,
  renamingCategory,
  resetBulkAdd,
  savedChannels,
  savedVideos,
  scannableChannelCount,
  scanningTag,
  searchKeyword,
  selectedCategoryTab,
  selectedChannelIds,
  setActiveTab,
  setAddMode,
  setApiKey,
  setBulkInput,
  setCategories,
  setIsEditingCategory,
  setLengthFilter,
  setNewCategoryName,
  setNewChannelInput,
  setNewChannelLang,
  setNewChannelNote,
  setRenameValue,
  setSearchKeyword,
  setSelectedCategoryTab,
  setShowWorkPanel,
  setSortType,
  setTtoTtoMode,
  setViewFilter,
  setViewMode,
  showWorkPanel,
  sortType,
  startRenameCategory,
  toggleCheckVideo,
  toggleChannelSelection,
  toggleNewChannelTag,
  toggleScrapVideo,
  totalVideoCount,
  ttoTtoAssetCount,
  ttoTtoMode,
  updateChannelMetadata,
  updateDiscoveryLink,
  updateVideoUserRecord,
  updatingChannelId,
  videoUserRecords,
  videos,
  viewFilter,
  viewMode,
  visibleScrapCount,
}) {
  return (
    <div className={`w-full mx-auto grid grid-cols-1 gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 ${showWorkPanel ? 'max-w-[2400px] xl:grid-cols-[340px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(0,1fr)]' : 'max-w-[2400px]'}`}>
      <LegacyChannelPanel
        addMode={addMode}
        apiKey={apiKey}
        bulkInput={bulkInput}
        bulkLoading={bulkLoading}
        bulkResult={bulkResult}
        cancelChannelPreview={cancelChannelPreview}
        cancelRenameCategory={cancelRenameCategory}
        categories={categories}
        channelPreview={channelPreview}
        channelsLoading={channelsLoading}
        cloudOnlyTags={cloudOnlyTags}
        confirmRenameCategory={confirmRenameCategory}
        error={error}
        getChannelScanDisplay={getChannelScanDisplay}
        getScannableChannelCount={getScannableChannelCount}
        handleBulkAdd={handleBulkAdd}
        handlePreviewChannel={handlePreviewChannel}
        handleSaveChannel={handleSaveChannel}
        handleTagScan={handleTagScan}
        isEditingCategory={isEditingCategory}
        isScanning={isScanning}
        loading={loading}
        newCategoryName={newCategoryName}
        newChannelInput={newChannelInput}
        newChannelLang={newChannelLang}
        newChannelNote={newChannelNote}
        newChannelTags={newChannelTags}
        onChangeApiKey={setApiKey}
        onDeleteChannel={deleteChannel}
        onLoadStoredVideos={loadStoredVideosForSelectedChannels}
        onOpenNotes={openNotesModal}
        onToggleChannelSelection={toggleChannelSelection}
        onUpdateChannelMetadata={updateChannelMetadata}
        previewLoading={previewLoading}
        progressMsg={progressMsg}
        renameLoading={renameLoading}
        renameValue={renameValue}
        renamingCategory={renamingCategory}
        resetBulkAdd={resetBulkAdd}
        savedChannels={savedChannels}
        scanningTag={scanningTag}
        selectedCategoryTab={selectedCategoryTab}
        selectedChannelIds={selectedChannelIds}
        setAddMode={setAddMode}
        setBulkInput={setBulkInput}
        setCategories={setCategories}
        setIsEditingCategory={setIsEditingCategory}
        setNewCategoryName={setNewCategoryName}
        setNewChannelInput={setNewChannelInput}
        setNewChannelLang={setNewChannelLang}
        setNewChannelNote={setNewChannelNote}
        setRenameValue={setRenameValue}
        setSelectedCategoryTab={setSelectedCategoryTab}
        showWorkPanel={showWorkPanel}
        startRenameCategory={startRenameCategory}
        toggleNewChannelTag={toggleNewChannelTag}
        updatingChannelId={updatingChannelId}
      />

      <div className="flex flex-col h-full space-y-4 min-w-0">
        <WorkspaceTabs
          activeTab={activeTab}
          savedVideoCount={savedVideos.length}
          onSelectTab={setActiveTab}
        />

        {activeTab === 'dashboard' ? (
          <>
            <VideoDashboardControls
              activeSelectedChannelCount={activeSelectedChannelCount}
              checkedVideos={checkedVideos}
              copiedPrompt={copiedPrompt}
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
        ) : (
          <ScrapbookWorkspace
            creatorView={creatorView}
            discoveryLinks={discoveryLinks}
            savedVideos={savedVideos}
            videoUserRecords={videoUserRecords}
            onCopyPrompt={() => copyPromptForVideos(savedVideos)}
            onFetchComments={fetchTopComments}
            onMoveVideo={markRadarVideoStatus}
            onOpenDiscoveryLinks={() => openCreatorView({ id: 'vault-sources' })}
            onOpenReferenceVault={() => openCreatorView({ id: 'vault-all' })}
            onRemoveScrap={toggleScrapVideo}
            onUpdateDiscoveryLink={updateDiscoveryLink}
            onUpdateVideoRecord={updateVideoUserRecord}
          />
        )}
      </div>

      <HiddenLegacyAside
        checkedVideoCount={checkedVideos.length}
        savedVideoCount={savedVideos.length}
        selectedChannelCount={selectedChannelIds.length}
        videoCount={totalVideoCount}
      />
    </div>
  );
}
