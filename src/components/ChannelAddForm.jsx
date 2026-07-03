import React from 'react';
import { Settings } from 'lucide-react';
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
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-bold text-indigo-800 block">새 채널 모니터링 추가</label>
        <div className="flex items-center gap-2">
          {!channelPreview && (
            <div className="flex bg-white rounded-md border border-indigo-200 overflow-hidden text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setAddMode('single')}
                className={`px-2 py-1 transition-colors ${addMode === 'single' ? 'bg-indigo-600 text-white' : 'text-indigo-500 hover:bg-indigo-50'}`}
                title="채널을 하나씩 확인하고 추가"
                aria-label="단일 채널 추가 모드"
              >
                단일
              </button>
              <button
                type="button"
                onClick={() => setAddMode('bulk')}
                className={`px-2 py-1 transition-colors ${addMode === 'bulk' ? 'bg-indigo-600 text-white' : 'text-indigo-500 hover:bg-indigo-50'}`}
                title="여러 채널을 한 번에 확인하고 추가"
                aria-label="채널 일괄 추가 모드"
              >
                일괄
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsEditingCategory(!isEditingCategory)}
            className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold whitespace-nowrap"
            title="화면 카테고리와 Cloud 태그 이름을 관리"
            aria-label="카테고리 설정 열기"
          >
            <Settings className="w-3 h-3" /> 카테고리 설정
          </button>
        </div>
      </div>

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
