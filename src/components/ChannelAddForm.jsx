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
  return (
    <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 mb-4">
      <ChannelAddFormHeader
        addMode={addMode}
        channelPreview={channelPreview}
        isEditingCategory={isEditingCategory}
        setAddMode={setAddMode}
        setIsEditingCategory={setIsEditingCategory}
      />

      {isEditingCategory && (
        <ChannelCategorySettings
          cancelRenameCategory={cancelRenameCategory}
          categories={categories}
          cloudOnlyTags={cloudOnlyTags}
          confirmRenameCategory={confirmRenameCategory}
          newCategoryName={newCategoryName}
          renameLoading={renameLoading}
          renameValue={renameValue}
          renamingCategory={renamingCategory}
          setCategories={setCategories}
          setNewCategoryName={setNewCategoryName}
          setRenameValue={setRenameValue}
          startRenameCategory={startRenameCategory}
        />
      )}

      {addMode === 'bulk' ? (
        <ChannelBulkAddForm
          bulkInput={bulkInput}
          bulkLoading={bulkLoading}
          bulkResult={bulkResult}
          categories={categories}
          handleBulkAdd={handleBulkAdd}
          newChannelLang={newChannelLang}
          newChannelTags={newChannelTags}
          resetBulkAdd={resetBulkAdd}
          setBulkInput={setBulkInput}
          setNewChannelLang={setNewChannelLang}
          toggleNewChannelTag={toggleNewChannelTag}
        />
      ) : (
        <ChannelSingleAddForm
          cancelChannelPreview={cancelChannelPreview}
          categories={categories}
          channelPreview={channelPreview}
          handlePreviewChannel={handlePreviewChannel}
          handleSaveChannel={handleSaveChannel}
          loading={loading}
          newChannelInput={newChannelInput}
          newChannelLang={newChannelLang}
          newChannelNote={newChannelNote}
          newChannelTags={newChannelTags}
          previewLoading={previewLoading}
          setNewChannelInput={setNewChannelInput}
          setNewChannelLang={setNewChannelLang}
          setNewChannelNote={setNewChannelNote}
          toggleNewChannelTag={toggleNewChannelTag}
        />
      )}
    </div>
  );
}
