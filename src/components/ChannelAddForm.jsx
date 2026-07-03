import React from 'react';
import { Loader2, Plus, Settings, X } from 'lucide-react';
import { LANGUAGES } from '../constants/languages';
import ChannelCategorySettings from './ChannelCategorySettings';

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
        <div className="space-y-2 animate-in fade-in duration-200">
          <textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder={'핸들 / 채널링크 / 영상링크를 한 줄에 하나씩 붙여넣으세요\n예)\n@channel1\nhttps://youtube.com/@channel2\nhttps://youtu.be/xxxxxxxxxxx'}
            className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-lg outline-none resize-none font-mono text-xs"
            rows={5}
            disabled={bulkLoading}
            aria-label="일괄 추가할 채널 목록"
          />
          <p className="text-[10px] text-slate-500">{bulkInput.split('\n').map((l) => l.trim()).filter(Boolean).length}개 줄 인식됨. YouTube에서 채널 정보를 확인한 뒤 클라우드 목록에 저장합니다. 영상 수집은 하지 않습니다.</p>

          <div>
            <p className="text-[10px] text-slate-500 mb-1">태그 선택 (전체 일괄 적용, 여러 개 가능)</p>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleNewChannelTag(cat)}
                  className={`px-2 py-1 rounded-full text-[11px] font-semibold border transition-colors ${newChannelTags.includes(cat) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                  title={`${cat} 태그 ${newChannelTags.includes(cat) ? '선택 해제' : '선택'}`}
                  aria-label={`${cat} 태그 ${newChannelTags.includes(cat) ? '선택 해제' : '선택'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <select
            value={newChannelLang}
            onChange={(e) => setNewChannelLang(e.target.value)}
            className="w-full text-sm px-2 py-2 bg-white border border-indigo-200 rounded-lg outline-none cursor-pointer font-medium"
            title="채널 기본 언어 선택"
            aria-label="채널 기본 언어 선택"
          >
            {LANGUAGES.map((lang) => <option key={lang.code} value={lang.code}>{lang.label}</option>)}
          </select>

          <button
            type="button"
            onClick={handleBulkAdd}
            disabled={bulkLoading || !bulkInput.trim()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors"
            title="YouTube에서 채널 정보를 확인한 뒤 Cloud 채널 목록에 저장합니다. 영상 수집은 하지 않습니다."
            aria-label="YouTube 확인 후 채널 일괄 저장"
          >
            {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {bulkLoading ? 'YouTube 확인 후 저장 중...' : 'YouTube 확인 후 일괄 저장'}
          </button>

          {bulkResult && (
            <div className="p-2 bg-white rounded-lg border border-indigo-200 text-xs space-y-1 max-h-32 overflow-y-auto">
              <p className="font-bold text-slate-700">총 {bulkResult.total}개 중 {bulkResult.added}개 성공</p>
              {bulkResult.results.filter((r) => !r.success).map((r, i) => (
                <p key={i} className="text-red-500 truncate">✗ {r.handle}: {r.error}</p>
              ))}
              <button
                type="button"
                onClick={resetBulkAdd}
                className="mt-1 w-full text-center text-indigo-600 hover:text-indigo-800 font-semibold"
                title="일괄 저장 결과 닫기"
                aria-label="채널 일괄 저장 결과 닫기"
              >
                닫기
              </button>
            </div>
          )}
        </div>
      ) : !channelPreview ? (
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <input
              type="text"
              value={newChannelInput}
              onChange={(e) => setNewChannelInput(e.target.value)}
              placeholder="핸들 / 채널링크 / 영상링크"
              className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-lg outline-none"
              aria-label="확인할 채널 핸들, 채널 링크 또는 영상 링크"
              onKeyDown={(e) => e.key === 'Enter' && handlePreviewChannel()}
            />
            <button
              type="button"
              onClick={handlePreviewChannel}
              disabled={previewLoading}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
              title="YouTube에서 채널 정보만 확인합니다. Cloud 저장과 영상 수집은 하지 않습니다."
              aria-label="YouTube에서 채널 정보 확인"
            >
              {previewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              YouTube에서 확인
            </button>
          </div>
          <p className="text-[10px] text-slate-500">아직 클라우드에 저장하지 않고 YouTube에서 채널 정보만 먼저 확인합니다. 영상 수집은 하지 않습니다.</p>
        </div>
      ) : (
        <div className="space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-indigo-200">
            <img src={channelPreview.thumbnail} alt="" className="w-9 h-9 rounded-full border border-slate-200" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{channelPreview.title}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">✓ 채널 확인됨</p>
            </div>
            <button
              type="button"
              onClick={cancelChannelPreview}
              className="text-slate-400 hover:text-slate-600"
              title="채널 확인 결과 닫기"
              aria-label="채널 확인 결과 닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <p className="text-[10px] text-slate-500 mb-1">태그 선택 (여러 개 가능, 안 골라도 OK)</p>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleNewChannelTag(cat)}
                  className={`px-2 py-1 rounded-full text-[11px] font-semibold border transition-colors ${newChannelTags.includes(cat) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                  title={`${cat} 태그 ${newChannelTags.includes(cat) ? '선택 해제' : '선택'}`}
                  aria-label={`${cat} 태그 ${newChannelTags.includes(cat) ? '선택 해제' : '선택'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <select
            value={newChannelLang}
            onChange={(e) => setNewChannelLang(e.target.value)}
            className="w-full text-sm px-2 py-2 bg-white border border-indigo-200 rounded-lg outline-none cursor-pointer font-medium"
            title="채널 기본 언어 선택"
            aria-label="채널 기본 언어 선택"
          >
            {LANGUAGES.map((lang) => <option key={lang.code} value={lang.code}>{lang.label}</option>)}
          </select>

          <textarea
            value={newChannelNote}
            onChange={(e) => setNewChannelNote(e.target.value)}
            placeholder="첫 기록 메모 (선택) - 예) 시니어롱폼 소재용, 톤 비슷함"
            className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-lg outline-none resize-none"
            rows={2}
            aria-label="새 채널 첫 기록 메모"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={cancelChannelPreview}
              className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold transition-colors"
              title="채널 저장을 취소하고 입력 화면으로 돌아가기"
              aria-label="채널 저장 취소"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSaveChannel}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors"
              title="채널을 Cloud 목록에 저장합니다. 새 영상 수집은 하지 않습니다."
              aria-label="채널을 Cloud 목록에 저장"
            >
              채널 저장
            </button>
          </div>
          <p className="text-[10px] text-slate-500">채널을 클라우드 목록에 저장합니다. 새 영상 수집은 별도의 수집 버튼을 눌렀을 때만 진행됩니다.</p>
        </div>
      )}
    </div>
  );
}
