import CreatorAppLayout from './components/CreatorAppLayout';
import CreatorComingSoonRoute from './components/CreatorComingSoonRoute';
import CreatorDiscoveryLinksRoute from './components/CreatorDiscoveryLinksRoute';
import CreatorHomeRoute from './components/CreatorHomeRoute';
import LegacyWorkspaceView from './components/LegacyWorkspaceView';
import { useAppRuntimeState } from './hooks/useAppRuntimeState';
import { useCategories } from './hooks/useCategories';
import { useChannelAddActions } from './hooks/useChannelAddActions';
import { useChannelActions } from './hooks/useChannelActions';
import { useChannelFormState } from './hooks/useChannelFormState';
import { useChannelNotesModal } from './hooks/useChannelNotesModal';
import { useChannelSelection } from './hooks/useChannelSelection';
import { useCloudChannels } from './hooks/useCloudChannels';
import { useCreatorOsMetrics } from './hooks/useCreatorOsMetrics';
import { useCreatorWorkspaceNavigation } from './hooks/useCreatorWorkspaceNavigation';
import { useDiscoveryLinks } from './hooks/useDiscoveryLinks';
import { useScrapbook } from './hooks/useScrapbook';
import { useAppSyncWarnings } from './hooks/useAppSyncWarnings';
import { useTagRenameActions } from './hooks/useTagRenameActions';
import { useTopComments } from './hooks/useTopComments';
import { useVideoCollectionActions } from './hooks/useVideoCollectionActions';
import { useVideoExplorerState } from './hooks/useVideoExplorerState';
import { useVideoProductionActions } from './hooks/useVideoProductionActions';
import { useVideoSelection } from './hooks/useVideoSelection';
import { useVideoUserRecords } from './hooks/useVideoUserRecords';

export default function App() {
  // 상태 관리
  const { categories, setCategories } = useCategories();

  const {
    apiKey,
    error,
    isScanning,
    loading,
    progressMsg,
    scanningTag,
    setApiKey,
    setError,
    setIsScanning,
    setLoading,
    setProgressMsg,
    setScanningTag,
    setUpdatingChannelId,
    setVideos,
    updatingChannelId,
    videos,
  } = useAppRuntimeState();
  
  const {
    selectedCategoryTab,
    selectedChannelIds,
    setSelectedCategoryTab,
    setSelectedChannelIds,
    toggleChannelSelection,
  } = useChannelSelection(categories[0]);
  const {
    addMode,
    bulkInput,
    bulkLoading,
    bulkResult,
    cancelChannelPreview,
    cancelRenameCategory,
    channelPreview,
    isEditingCategory,
    newCategoryName,
    newChannelInput,
    newChannelLang,
    newChannelNote,
    newChannelTags,
    previewLoading,
    renameLoading,
    renameValue,
    renamingCategory,
    resetBulkAdd,
    setAddMode,
    setBulkInput,
    setBulkLoading,
    setBulkResult,
    setChannelPreview,
    setIsEditingCategory,
    setNewCategoryName,
    setNewChannelInput,
    setNewChannelLang,
    setNewChannelNote,
    setPreviewLoading,
    setRenameLoading,
    setRenameValue,
    startRenameCategory,
    toggleNewChannelTag,
  } = useChannelFormState();
  const {
    savedChannels,
    setSavedChannels,
    channelsLoading,
    loadChannelsFromCloud,
  } = useCloudChannels({ onError: setError });
  const {
    saveChannel,
    bulkCreateChannels,
    deleteChannel,
    updateChannelMetadata,
    saveChannelNote,
  } = useChannelActions({
    setSavedChannels,
    setSelectedChannelIds,
    setUpdatingChannelId,
    setError,
  });
  const {
    handleBulkAdd,
    handlePreviewChannel,
    handleSaveChannel,
  } = useChannelAddActions({
    bulkCreateChannels,
    bulkInput,
    cancelChannelPreview,
    channelPreview,
    loadChannelsFromCloud,
    newChannelInput,
    newChannelLang,
    newChannelNote,
    newChannelTags,
    savedChannels,
    saveChannel,
    setBulkLoading,
    setBulkResult,
    setChannelPreview,
    setError,
    setLoading,
    setPreviewLoading,
    setProgressMsg,
    setSelectedCategoryTab,
  });
  const {
    addChannelNote,
    changeNoteText,
    closeNotesModal,
    notesModal,
    openNotesModal,
  } = useChannelNotesModal({ saveChannelNote, onError: setError });
  const {
    savedVideos,
    scrapbookSyncWarning,
    isVideoSaved,
    toggleScrapVideo,
  } = useScrapbook();
  const {
    videoUserRecords,
    videoRecordsSyncWarning,
    markVideoStatus: markRadarVideoStatus,
    updateVideoUserRecord,
    restoreVideoToRadar,
    clearRadarDecisions,
  } = useVideoUserRecords();
  const {
    isProductionCandidate,
    promoteVideoToProduction,
  } = useVideoProductionActions({
    isVideoSaved,
    markVideoStatus: markRadarVideoStatus,
    toggleScrapVideo,
    videoUserRecords,
  });
  const {
    filteredAndSortedVideos,
    lengthFilter,
    searchKeyword,
    setLengthFilter,
    setSearchKeyword,
    setSortType,
    setTtoTtoMode,
    setViewFilter,
    setViewMode,
    sortType,
    ttoTtoMode,
    viewFilter,
    viewMode,
  } = useVideoExplorerState(videos);
  const {
    checkedVideos,
    clearCheckedVideos,
    copiedPrompt,
    copyPromptForVideos,
    promptCopyError,
    toggleCheckVideo,
  } = useVideoSelection();
  const {
    closeTopCommentsModal,
    commentModal,
    fetchTopComments,
  } = useTopComments({ apiKey, onError: setError });
  const {
    activeCreatorItem,
    activeTab,
    creatorView,
    isComingSoonView,
    isDiscoveryLinksView,
    isHomeView,
    isLegacyWorkspaceView,
    isReferenceVaultView,
    openCreatorView,
    setActiveTab,
    setShowWorkPanel,
    showWorkPanel,
  } = useCreatorWorkspaceNavigation();
  const {
    discoveryLinks,
    discoveryLinksError,
    discoveryLinksLoading,
    discoveryLinksNotice,
    discoveryLinksSaving,
    discoveryLinksSavingMessage,
    addDiscoveryLink,
    changeDiscoveryLink,
    loadDiscoveryLinks,
    removeDiscoveryLink,
  } = useDiscoveryLinks();
  const {
    handleManualScan,
    handleTagScan,
    loadStoredVideosForSelectedChannels,
  } = useVideoCollectionActions({
    clearCheckedVideos,
    loadChannelsFromCloud,
    savedChannels,
    selectedChannelIds,
    setActiveTab,
    setError,
    setIsScanning,
    setLoading,
    setProgressMsg,
    setScanningTag,
    setVideos,
  });
  const {
    confirmRenameCategory,
  } = useTagRenameActions({
    cancelRenameCategory,
    categories,
    loadChannelsFromCloud,
    renameValue,
    renamingCategory,
    selectedCategoryTab,
    setCategories,
    setError,
    setProgressMsg,
    setRenameLoading,
    setSelectedCategoryTab,
  });

  const {
    activeSelectedChannelCount,
    cloudOnlyTags,
    discoveryCandidateCount,
    discoveryRightsWarningCount,
    latestScanText,
    openRadarCandidateCount,
    productionCandidateCount,
    scannableChannelCount,
    ttoTtoAssetCount,
    visibleScrapCount,
  } = useCreatorOsMetrics({
    categories,
    discoveryLinks,
    savedChannels,
    savedVideos,
    selectedChannelIds,
    videoUserRecords,
    videos,
  });
  const syncWarnings = useAppSyncWarnings({
    scrapbookSyncWarning,
    videoRecordsSyncWarning,
  });

  return (
    <CreatorAppLayout
      activeCreatorItem={activeCreatorItem}
      channelCount={savedChannels.length}
      commentModal={commentModal}
      creatorView={creatorView}
      discoveryCandidateCount={discoveryCandidateCount}
      notesModal={notesModal}
      onAddNote={addChannelNote}
      onChangeNoteText={changeNoteText}
      onCloseNotes={closeNotesModal}
      onCloseTopComments={closeTopCommentsModal}
      onOpenCreatorView={openCreatorView}
      savedVideoCount={savedVideos.length}
      selectedChannelCount={selectedChannelIds.length}
      syncWarnings={syncWarnings}
      videoCount={videos.length}
    >
          {isHomeView ? (
            <CreatorHomeRoute
              clearRadarDecisions={clearRadarDecisions}
              isVideoSaved={isVideoSaved}
              latestScanText={latestScanText}
              markRadarVideoStatus={markRadarVideoStatus}
              openRadarCandidateCount={openRadarCandidateCount}
              discoveryCandidateCount={discoveryCandidateCount}
              discoveryRightsWarningCount={discoveryRightsWarningCount}
              onOpenView={openCreatorView}
              productionCandidateCount={productionCandidateCount}
              promoteVideoToProduction={promoteVideoToProduction}
              restoreVideoToRadar={restoreVideoToRadar}
              savedChannels={savedChannels}
              savedVideos={savedVideos}
              toggleScrapVideo={toggleScrapVideo}
              ttoTtoAssetCount={ttoTtoAssetCount}
              videoUserRecords={videoUserRecords}
              videos={videos}
            />
          ) : isComingSoonView ? (
            <CreatorComingSoonRoute item={activeCreatorItem} />
          ) : isDiscoveryLinksView ? (
            <CreatorDiscoveryLinksRoute
              addDiscoveryLink={addDiscoveryLink}
              changeDiscoveryLink={changeDiscoveryLink}
              discoveryLinks={discoveryLinks}
              discoveryLinksError={discoveryLinksError}
              discoveryLinksLoading={discoveryLinksLoading}
              discoveryLinksNotice={discoveryLinksNotice}
              discoveryLinksSaving={discoveryLinksSaving}
              discoveryLinksSavingMessage={discoveryLinksSavingMessage}
              loadDiscoveryLinks={loadDiscoveryLinks}
              removeDiscoveryLink={removeDiscoveryLink}
            />
          ) : isLegacyWorkspaceView ? (
            <LegacyWorkspaceView
              activeSelectedChannelCount={activeSelectedChannelCount}
              activeTab={activeTab}
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
              checkedVideos={checkedVideos}
              cloudOnlyTags={cloudOnlyTags}
              confirmRenameCategory={confirmRenameCategory}
              copiedPrompt={copiedPrompt}
              copyPromptForVideos={copyPromptForVideos}
              promptCopyError={promptCopyError}
              creatorView={creatorView}
              discoveryLinks={discoveryLinks}
              deleteChannel={deleteChannel}
              error={error}
              fetchTopComments={fetchTopComments}
              filteredAndSortedVideos={filteredAndSortedVideos}
              handleBulkAdd={handleBulkAdd}
              handleManualScan={handleManualScan}
              handlePreviewChannel={handlePreviewChannel}
              handleSaveChannel={handleSaveChannel}
              handleTagScan={handleTagScan}
              isEditingCategory={isEditingCategory}
              isProductionCandidate={isProductionCandidate}
              isReferenceVaultView={isReferenceVaultView}
              isScanning={isScanning}
              isVideoSaved={isVideoSaved}
              lengthFilter={lengthFilter}
              loadStoredVideosForSelectedChannels={loadStoredVideosForSelectedChannels}
              loading={loading}
              markRadarVideoStatus={markRadarVideoStatus}
              newCategoryName={newCategoryName}
              newChannelInput={newChannelInput}
              newChannelLang={newChannelLang}
              newChannelNote={newChannelNote}
              newChannelTags={newChannelTags}
              openCreatorView={openCreatorView}
              openNotesModal={openNotesModal}
              previewLoading={previewLoading}
              progressMsg={progressMsg}
              promoteVideoToProduction={promoteVideoToProduction}
              renameLoading={renameLoading}
              renameValue={renameValue}
              renamingCategory={renamingCategory}
              resetBulkAdd={resetBulkAdd}
              savedChannels={savedChannels}
              savedVideos={savedVideos}
              scannableChannelCount={scannableChannelCount}
              scanningTag={scanningTag}
              searchKeyword={searchKeyword}
              selectedCategoryTab={selectedCategoryTab}
              selectedChannelIds={selectedChannelIds}
              setActiveTab={setActiveTab}
              setAddMode={setAddMode}
              setApiKey={setApiKey}
              setBulkInput={setBulkInput}
              setCategories={setCategories}
              setIsEditingCategory={setIsEditingCategory}
              setLengthFilter={setLengthFilter}
              setNewCategoryName={setNewCategoryName}
              setNewChannelInput={setNewChannelInput}
              setNewChannelLang={setNewChannelLang}
              setNewChannelNote={setNewChannelNote}
              setRenameValue={setRenameValue}
              setSearchKeyword={setSearchKeyword}
              setSelectedCategoryTab={setSelectedCategoryTab}
              setShowWorkPanel={setShowWorkPanel}
              setSortType={setSortType}
              setTtoTtoMode={setTtoTtoMode}
              setViewFilter={setViewFilter}
              setViewMode={setViewMode}
              showWorkPanel={showWorkPanel}
              sortType={sortType}
              startRenameCategory={startRenameCategory}
              toggleCheckVideo={toggleCheckVideo}
              toggleChannelSelection={toggleChannelSelection}
              toggleNewChannelTag={toggleNewChannelTag}
              toggleScrapVideo={toggleScrapVideo}
              totalVideoCount={videos.length}
              ttoTtoAssetCount={ttoTtoAssetCount}
              ttoTtoMode={ttoTtoMode}
              updateChannelMetadata={updateChannelMetadata}
              updateDiscoveryLink={changeDiscoveryLink}
              updateVideoUserRecord={updateVideoUserRecord}
              updatingChannelId={updatingChannelId}
              videoUserRecords={videoUserRecords}
              videos={videos}
              viewFilter={viewFilter}
              viewMode={viewMode}
              visibleScrapCount={visibleScrapCount}
            />
          ) : null}
    </CreatorAppLayout>
  );
}
