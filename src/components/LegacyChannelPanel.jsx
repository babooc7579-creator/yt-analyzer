import ChannelAddForm from './ChannelAddForm';
import ChannelList from './ChannelList';
import ChannelTagTabs from './ChannelTagTabs';
import LegacyWorkPanelIntro from './LegacyWorkPanelIntro';
import LoadStoredVideosButton from './LoadStoredVideosButton';
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
  getScannableChannelCount,
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
  return (
    <div className={`space-y-4 ${showWorkPanel ? '' : 'hidden'}`}>
      <div className="bg-slate-100 rounded-xl shadow-sm border border-slate-300 p-4">
        <LegacyWorkPanelIntro
          apiKey={apiKey}
          onChangeApiKey={onChangeApiKey}
        />

        <ChannelAddForm
          addMode={addMode}
          setAddMode={setAddMode}
          bulkInput={bulkInput}
          setBulkInput={setBulkInput}
          bulkLoading={bulkLoading}
          bulkResult={bulkResult}
          resetBulkAdd={resetBulkAdd}
          handleBulkAdd={handleBulkAdd}
          categories={categories}
          cloudOnlyTags={cloudOnlyTags}
          setCategories={setCategories}
          newCategoryName={newCategoryName}
          setNewCategoryName={setNewCategoryName}
          isEditingCategory={isEditingCategory}
          setIsEditingCategory={setIsEditingCategory}
          renamingCategory={renamingCategory}
          renameValue={renameValue}
          setRenameValue={setRenameValue}
          renameLoading={renameLoading}
          startRenameCategory={startRenameCategory}
          confirmRenameCategory={confirmRenameCategory}
          cancelRenameCategory={cancelRenameCategory}
          newChannelInput={newChannelInput}
          setNewChannelInput={setNewChannelInput}
          newChannelTags={newChannelTags}
          toggleNewChannelTag={toggleNewChannelTag}
          newChannelLang={newChannelLang}
          setNewChannelLang={setNewChannelLang}
          newChannelNote={newChannelNote}
          setNewChannelNote={setNewChannelNote}
          channelPreview={channelPreview}
          previewLoading={previewLoading}
          handlePreviewChannel={handlePreviewChannel}
          cancelChannelPreview={cancelChannelPreview}
          handleSaveChannel={handleSaveChannel}
          loading={loading}
        />

        <ChannelTagTabs
          categories={categories}
          channels={savedChannels}
          selectedCategory={selectedCategoryTab}
          getScannableChannelCount={getScannableChannelCount}
          scanningTag={scanningTag}
          isScanning={isScanning}
          onSelectCategory={setSelectedCategoryTab}
          onScanTag={handleTagScan}
        />

        <hr className="my-4 border-slate-100" />

        <ChannelList
          channels={savedChannels}
          selectedCategory={selectedCategoryTab}
          selectedChannelIds={selectedChannelIds}
          channelsLoading={channelsLoading}
          getScanDisplay={getChannelScanDisplay}
          onToggleSelection={onToggleChannelSelection}
          onOpenNotes={onOpenNotes}
          onUpdateMetadata={onUpdateChannelMetadata}
          updatingChannelId={updatingChannelId}
          onDelete={onDeleteChannel}
        />

        <LoadStoredVideosButton
          loading={loading}
          selectedChannelCount={selectedChannelIds.length}
          onLoad={onLoadStoredVideos}
        />
        {error && <p className="mt-2 text-xs text-red-500 text-center">{error}</p>}
        {progressMsg && !error && <p className="mt-2 text-xs text-indigo-600 text-center font-medium">{progressMsg}</p>}
      </div>
    </div>
  );
}
