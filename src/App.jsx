import CreatorAppLayout from './components/CreatorAppLayout';
import CreatorAppRoutes from './components/CreatorAppRoutes';
import { useAppRuntimeState } from './hooks/useAppRuntimeState';
import { useCategories } from './hooks/useCategories';
import { useChannelAddActions } from './hooks/useChannelAddActions';
import { useChannelActions } from './hooks/useChannelActions';
import { useChannelFormState } from './hooks/useChannelFormState';
import { useChannelNotesModal } from './hooks/useChannelNotesModal';
import { useChannelSelection } from './hooks/useChannelSelection';
import { useCloudChannels } from './hooks/useCloudChannels';
import { useCreatorAppDerivedState } from './hooks/useCreatorAppDerivedState';
import { useCreatorWorkspaceNavigation } from './hooks/useCreatorWorkspaceNavigation';
import { useDiscoveryLinks } from './hooks/useDiscoveryLinks';
import { useScrapbook } from './hooks/useScrapbook';
import { useTagRenameActions } from './hooks/useTagRenameActions';
import { useTopComments } from './hooks/useTopComments';
import { useVideoCollectionActions } from './hooks/useVideoCollectionActions';
import { useVideoExplorerState } from './hooks/useVideoExplorerState';
import { useVideoProductionActions } from './hooks/useVideoProductionActions';
import { useVideoSelection } from './hooks/useVideoSelection';
import { useVideoUserRecords } from './hooks/useVideoUserRecords';
import { useCreatorAppViewProps } from './hooks/useCreatorAppViewProps';

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
    syncWarnings,
    ttoTtoAssetCount,
    visibleScrapCount,
  } = useCreatorAppDerivedState({
    categories,
    discoveryLinks,
    savedChannels,
    savedVideos,
    scrapbookSyncWarning,
    selectedChannelIds,
    videoRecordsSyncWarning,
    videoUserRecords,
    videos,
  });
  const { layoutProps, routesProps } = useCreatorAppViewProps({
    activeSelectedChannelCount,
    activeCreatorItem,
    activeTab,
    addChannelNote,
    addDiscoveryLink,
    addMode,
    apiKey,
    bulkInput,
    bulkLoading,
    bulkResult,
    cancelChannelPreview,
    cancelRenameCategory,
    categories,
    changeDiscoveryLink,
    changeNoteText,
    channelPreview,
    channelsLoading,
    checkedVideos,
    clearRadarDecisions,
    closeNotesModal,
    closeTopCommentsModal,
    cloudOnlyTags,
    commentModal,
    confirmRenameCategory,
    copiedPrompt,
    copyPromptForVideos,
    creatorView,
    deleteChannel,
    discoveryCandidateCount,
    discoveryLinks,
    discoveryLinksError,
    discoveryLinksLoading,
    discoveryLinksNotice,
    discoveryLinksSaving,
    discoveryLinksSavingMessage,
    discoveryRightsWarningCount,
    error,
    fetchTopComments,
    filteredAndSortedVideos,
    handleBulkAdd,
    handleManualScan,
    handlePreviewChannel,
    handleSaveChannel,
    handleTagScan,
    isComingSoonView,
    isDiscoveryLinksView,
    isEditingCategory,
    isHomeView,
    isLegacyWorkspaceView,
    isProductionCandidate,
    isReferenceVaultView,
    isScanning,
    isVideoSaved,
    latestScanText,
    lengthFilter,
    loadDiscoveryLinks,
    loadStoredVideosForSelectedChannels,
    loading,
    markRadarVideoStatus,
    newCategoryName,
    newChannelInput,
    newChannelLang,
    newChannelNote,
    newChannelTags,
    notesModal,
    openCreatorView,
    openNotesModal,
    openRadarCandidateCount,
    previewLoading,
    productionCandidateCount,
    progressMsg,
    promoteVideoToProduction,
    promptCopyError,
    removeDiscoveryLink,
    renameLoading,
    renameValue,
    renamingCategory,
    resetBulkAdd,
    restoreVideoToRadar,
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
    syncWarnings,
    toggleChannelSelection,
    toggleCheckVideo,
    toggleNewChannelTag,
    toggleScrapVideo,
    ttoTtoAssetCount,
    ttoTtoMode,
    updateChannelMetadata,
    updateVideoUserRecord,
    updatingChannelId,
    videoUserRecords,
    videos,
    viewFilter,
    viewMode,
    visibleScrapCount,
  });

  return (
    <CreatorAppLayout {...layoutProps}>
      <CreatorAppRoutes {...routesProps} />
    </CreatorAppLayout>
  );
}
