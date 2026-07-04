import LegacyWorkspaceView from './LegacyWorkspaceView';

export default function CreatorLegacyWorkspaceRoute(props) {
  const channelPanelProps = {
    addMode: props.addMode,
    apiKey: props.apiKey,
    bulkInput: props.bulkInput,
    bulkLoading: props.bulkLoading,
    bulkResult: props.bulkResult,
    cancelChannelPreview: props.cancelChannelPreview,
    cancelRenameCategory: props.cancelRenameCategory,
    categories: props.categories,
    channelPreview: props.channelPreview,
    channelsLoading: props.channelsLoading,
    cloudOnlyTags: props.cloudOnlyTags,
    confirmRenameCategory: props.confirmRenameCategory,
    error: props.error,
    handleBulkAdd: props.handleBulkAdd,
    handlePreviewChannel: props.handlePreviewChannel,
    handleSaveChannel: props.handleSaveChannel,
    handleTagScan: props.handleTagScan,
    isEditingCategory: props.isEditingCategory,
    isScanning: props.isScanning,
    loading: props.loading,
    newCategoryName: props.newCategoryName,
    newChannelInput: props.newChannelInput,
    newChannelLang: props.newChannelLang,
    newChannelNote: props.newChannelNote,
    newChannelTags: props.newChannelTags,
    onChangeApiKey: props.setApiKey,
    onDeleteChannel: props.deleteChannel,
    onLoadStoredVideos: props.loadStoredVideosForSelectedChannels,
    onOpenNotes: props.openNotesModal,
    onToggleChannelSelection: props.toggleChannelSelection,
    onUpdateChannelMetadata: props.updateChannelMetadata,
    previewLoading: props.previewLoading,
    progressMsg: props.progressMsg,
    renameLoading: props.renameLoading,
    renameValue: props.renameValue,
    renamingCategory: props.renamingCategory,
    resetBulkAdd: props.resetBulkAdd,
    savedChannels: props.savedChannels,
    scanningTag: props.scanningTag,
    selectedCategoryTab: props.selectedCategoryTab,
    selectedChannelIds: props.selectedChannelIds,
    setAddMode: props.setAddMode,
    setBulkInput: props.setBulkInput,
    setCategories: props.setCategories,
    setIsEditingCategory: props.setIsEditingCategory,
    setNewCategoryName: props.setNewCategoryName,
    setNewChannelInput: props.setNewChannelInput,
    setNewChannelLang: props.setNewChannelLang,
    setNewChannelNote: props.setNewChannelNote,
    setRenameValue: props.setRenameValue,
    setSelectedCategoryTab: props.setSelectedCategoryTab,
    showWorkPanel: props.showWorkPanel,
    startRenameCategory: props.startRenameCategory,
    toggleNewChannelTag: props.toggleNewChannelTag,
    updatingChannelId: props.updatingChannelId,
  };

  return (
    <LegacyWorkspaceView
      {...props}
      channelPanelProps={channelPanelProps}
    />
  );
}
