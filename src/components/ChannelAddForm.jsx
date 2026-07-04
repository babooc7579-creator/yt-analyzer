import ChannelAddFormHeader from './ChannelAddFormHeader';
import ChannelBulkAddForm from './ChannelBulkAddForm';
import ChannelCategorySettings from './ChannelCategorySettings';
import ChannelSingleAddForm from './ChannelSingleAddForm';

export default function ChannelAddForm({
  addMode,
  setAddMode,
  bulkInput,
  setBulkInput,
  bulkLoading,
  bulkResult,
  resetBulkAdd,
  handleBulkAdd,
  categories,
  cloudOnlyTags = [],
  setCategories,
  newCategoryName,
  setNewCategoryName,
  isEditingCategory,
  setIsEditingCategory,
  renamingCategory,
  renameValue,
  setRenameValue,
  renameLoading,
  startRenameCategory,
  confirmRenameCategory,
  cancelRenameCategory,
  newChannelInput,
  setNewChannelInput,
  newChannelTags,
  toggleNewChannelTag,
  newChannelLang,
  setNewChannelLang,
  newChannelNote,
  setNewChannelNote,
  channelPreview,
  previewLoading,
  handlePreviewChannel,
  cancelChannelPreview,
  handleSaveChannel,
  loading,
}) {
  const headerProps = {
    addMode,
    channelPreview,
    isEditingCategory,
    setAddMode,
    setIsEditingCategory,
  };

  const categorySettingsProps = {
    cancelRenameCategory,
    categories,
    cloudOnlyTags,
    confirmRenameCategory,
    newCategoryName,
    renameLoading,
    renameValue,
    renamingCategory,
    setCategories,
    setNewCategoryName,
    setRenameValue,
    startRenameCategory,
  };

  const bulkAddFormProps = {
    bulkInput,
    bulkLoading,
    bulkResult,
    categories,
    handleBulkAdd,
    newChannelLang,
    newChannelTags,
    resetBulkAdd,
    setBulkInput,
    setNewChannelLang,
    toggleNewChannelTag,
  };

  const singleAddFormProps = {
    cancelChannelPreview,
    categories,
    channelPreview,
    handlePreviewChannel,
    handleSaveChannel,
    loading,
    newChannelInput,
    newChannelLang,
    newChannelNote,
    newChannelTags,
    previewLoading,
    setNewChannelInput,
    setNewChannelLang,
    setNewChannelNote,
    toggleNewChannelTag,
  };

  return (
    <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 mb-4">
      <ChannelAddFormHeader {...headerProps} />

      {isEditingCategory && (
        <ChannelCategorySettings {...categorySettingsProps} />
      )}

      {addMode === 'bulk' ? (
        <ChannelBulkAddForm {...bulkAddFormProps} />
      ) : (
        <ChannelSingleAddForm {...singleAddFormProps} />
      )}
    </div>
  );
}
