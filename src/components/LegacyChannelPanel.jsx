import ChannelAddForm from './ChannelAddForm';
import ChannelList from './ChannelList';
import ChannelTagTabs from './ChannelTagTabs';
import LegacyChannelPanelFooter from './LegacyChannelPanelFooter';
import LegacyWorkPanelIntro from './LegacyWorkPanelIntro';
import { isChannelScannable } from '../constants/status';
import { getChannelScanDisplay } from '../utils/channelScanDisplay';

export default function LegacyChannelPanel({
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
  cloudOnlyTags,
  confirmRenameCategory,
  error,
  handleBulkAdd,
  handlePreviewChannel,
  handleSaveChannel,
  handleTagScan,
  isEditingCategory,
  isScanning,
  loading,
  newCategoryName,
  newChannelInput,
  newChannelLang,
  newChannelNote,
  newChannelTags,
  onChangeApiKey,
  onDeleteChannel,
  onLoadStoredVideos,
  onOpenNotes,
  onToggleChannelSelection,
  onUpdateChannelMetadata,
  previewLoading,
  progressMsg,
  renameLoading,
  renameValue,
  renamingCategory,
  resetBulkAdd,
  savedChannels,
  scanningTag,
  selectedCategoryTab,
  selectedChannelIds,
  setAddMode,
  setBulkInput,
  setCategories,
  setIsEditingCategory,
  setNewCategoryName,
  setNewChannelInput,
  setNewChannelLang,
  setNewChannelNote,
  setRenameValue,
  setSelectedCategoryTab,
  showWorkPanel,
  startRenameCategory,
  toggleNewChannelTag,
  updatingChannelId,
}) {
  const getScannableChannelCount = (category) => (
    savedChannels.filter(channel => (
      channel.tags?.includes(category) && isChannelScannable(channel)
    )).length
  );
  const introProps = {
    apiKey,
    onChangeApiKey,
  };

  const channelAddFormProps = {
    addMode,
    bulkInput,
    bulkLoading,
    bulkResult,
    cancelChannelPreview,
    cancelRenameCategory,
    categories,
    channelPreview,
    cloudOnlyTags,
    confirmRenameCategory,
    handleBulkAdd,
    handlePreviewChannel,
    handleSaveChannel,
    isEditingCategory,
    loading,
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
    setCategories,
    setIsEditingCategory,
    setNewCategoryName,
    setNewChannelInput,
    setNewChannelLang,
    setNewChannelNote,
    setRenameValue,
    startRenameCategory,
    toggleNewChannelTag,
  };

  const tagTabsProps = {
    categories,
    channels: savedChannels,
    getScannableChannelCount,
    isScanning,
    onScanTag: handleTagScan,
    onSelectCategory: setSelectedCategoryTab,
    scanningTag,
    selectedCategory: selectedCategoryTab,
  };

  const channelListProps = {
    channels: savedChannels,
    channelsLoading,
    getScanDisplay: getChannelScanDisplay,
    onDelete: onDeleteChannel,
    onOpenNotes,
    onToggleSelection: onToggleChannelSelection,
    onUpdateMetadata: onUpdateChannelMetadata,
    selectedCategory: selectedCategoryTab,
    selectedChannelIds,
    updatingChannelId,
  };

  const footerProps = {
    error,
    loading,
    onLoadStoredVideos,
    progressMsg,
    selectedChannelCount: selectedChannelIds.length,
  };

  return (
    <div className={`space-y-4 ${showWorkPanel ? '' : 'hidden'}`}>
      <div className="bg-slate-100 rounded-xl shadow-sm border border-slate-300 p-4">
        <LegacyWorkPanelIntro {...introProps} />

        <ChannelAddForm {...channelAddFormProps} />

        <ChannelTagTabs {...tagTabsProps} />

        <hr className="my-4 border-slate-100" />

        <ChannelList {...channelListProps} />

        <LegacyChannelPanelFooter {...footerProps} />
      </div>
    </div>
  );
}
