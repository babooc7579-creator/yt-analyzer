import React from 'react';
import { CheckCircle2, Loader2, Plus, Settings, Trash2, X } from 'lucide-react';
import { LANGUAGES } from '../constants/languages';

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
              <button onClick={() => setAddMode('single')} className={`px-2 py-1 transition-colors ${addMode === 'single' ? 'bg-indigo-600 text-white' : 'text-indigo-500 hover:bg-indigo-50'}`}>단일</button>
              <button onClick={() => setAddMode('bulk')} className={`px-2 py-1 transition-colors ${addMode === 'bulk' ? 'bg-indigo-600 text-white' : 'text-indigo-500 hover:bg-indigo-50'}`}>일괄</button>
            </div>
          )}
          <button onClick={() => setIsEditingCategory(!isEditingCategory)} className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold whitespace-nowrap">
            <Settings className="w-3 h-3" /> 카테고리 설정
          </button>
        </div>
      </div>

      {isEditingCategory && (
        <div className="mb-3 p-2 bg-white rounded border border-indigo-200 shadow-inner">
          <div className="flex gap-1 mb-2">
            <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="새 카테고리명" className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded" />
            <button onClick={() => { if (newCategoryName && !categories.includes(newCategoryName)) { setCategories([...categories, newCategoryName]); setNewCategoryName(''); } }} className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-bold whitespace-nowrap"><Plus className="w-3 h-3" /></button>
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              renamingCategory === cat ? (
                <span key={cat} className="inline-flex items-center gap-1 px-1 py-0.5 bg-white border border-indigo-300 rounded ring-1 ring-indigo-200">
                  <input
                    autoFocus
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') confirmRenameCategory(); if (e.key === 'Escape') cancelRenameCategory(); }}
                    className="text-[10px] px-1 py-0.5 w-16 border border-slate-200 rounded outline-none"
                  />
                  <button onClick={confirmRenameCategory} disabled={renameLoading} className="text-emerald-600 hover:text-emerald-800">
                    {renameLoading ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
                  </button>
                  <button onClick={cancelRenameCategory} className="text-slate-400 hover:text-slate-600"><X className="w-2.5 h-2.5" /></button>
                </span>
              ) : (
                <span key={cat} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600">
                  {cat}
                  <button onClick={() => startRenameCategory(cat)} className="text-indigo-400 hover:text-indigo-600" title="Cloud 태그 이름 변경 - 이 태그가 붙은 모든 채널에 일괄 반영됩니다"><Settings className="w-2.5 h-2.5" /></button>
                  <button onClick={() => setCategories(categories.filter((c) => c !== cat))} className="text-red-400 hover:text-red-600" title="화면 목록에서만 숨깁니다. 이미 채널에 붙은 Cloud 태그는 삭제되지 않습니다."><Trash2 className="w-2.5 h-2.5" /></button>
                </span>
              )
            ))}
          </div>
          <p className="text-[9px] text-slate-400 mt-1.5">⚙️ 이름 변경은 Cloud 태그를 바꿉니다. 휴지통은 화면 목록에서만 숨기며, 이미 채널에 붙은 Cloud 태그는 삭제하지 않습니다.</p>
          {cloudOnlyTags.length > 0 && (
            <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50 p-2 text-[10px] leading-relaxed text-amber-800">
              <p className="font-bold">Cloud에는 있지만 화면 목록에는 없는 태그가 있습니다.</p>
              <p className="mt-1 font-semibold">{cloudOnlyTags.slice(0, 4).join(', ')}{cloudOnlyTags.length > 4 ? ` 외 ${cloudOnlyTags.length - 4}개` : ''}</p>
              <p className="mt-1 text-amber-700">카테고리를 지워도 Cloud 채널 태그는 삭제되지 않습니다. 다시 보려면 같은 이름으로 카테고리를 추가하세요.</p>
            </div>
          )}
        </div>
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
          />
          <p className="text-[10px] text-slate-500">{bulkInput.split('\n').map((l) => l.trim()).filter(Boolean).length}개 줄 인식됨. 채널 정보를 YouTube에서 확인한 뒤 클라우드 목록에 저장합니다.</p>

          <div>
            <p className="text-[10px] text-slate-500 mb-1">태그 선택 (전체 일괄 적용, 여러 개 가능)</p>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleNewChannelTag(cat)}
                  className={`px-2 py-1 rounded-full text-[11px] font-semibold border transition-colors ${newChannelTags.includes(cat) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <select value={newChannelLang} onChange={(e) => setNewChannelLang(e.target.value)} className="w-full text-sm px-2 py-2 bg-white border border-indigo-200 rounded-lg outline-none cursor-pointer font-medium">
            {LANGUAGES.map((lang) => <option key={lang.code} value={lang.code}>{lang.label}</option>)}
          </select>

          <button onClick={handleBulkAdd} disabled={bulkLoading || !bulkInput.trim()} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors">
            {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {bulkLoading ? '일괄 등록 중...' : '일괄 등록'}
          </button>

          {bulkResult && (
            <div className="p-2 bg-white rounded-lg border border-indigo-200 text-xs space-y-1 max-h-32 overflow-y-auto">
              <p className="font-bold text-slate-700">총 {bulkResult.total}개 중 {bulkResult.added}개 성공</p>
              {bulkResult.results.filter((r) => !r.success).map((r, i) => (
                <p key={i} className="text-red-500 truncate">✗ {r.handle}: {r.error}</p>
              ))}
              <button onClick={resetBulkAdd} className="mt-1 w-full text-center text-indigo-600 hover:text-indigo-800 font-semibold">닫기</button>
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
              onKeyDown={(e) => e.key === 'Enter' && handlePreviewChannel()}
            />
            <button onClick={handlePreviewChannel} disabled={previewLoading} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap">
              {previewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              채널 미리보기
            </button>
          </div>
          <p className="text-[10px] text-slate-500">아직 클라우드에 저장하지 않고 YouTube에서 채널 정보만 먼저 확인합니다.</p>
        </div>
      ) : (
        <div className="space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-indigo-200">
            <img src={channelPreview.thumbnail} alt="" className="w-9 h-9 rounded-full border border-slate-200" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{channelPreview.title}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">✓ 채널 확인됨</p>
            </div>
            <button onClick={cancelChannelPreview} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
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
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <select value={newChannelLang} onChange={(e) => setNewChannelLang(e.target.value)} className="w-full text-sm px-2 py-2 bg-white border border-indigo-200 rounded-lg outline-none cursor-pointer font-medium">
            {LANGUAGES.map((lang) => <option key={lang.code} value={lang.code}>{lang.label}</option>)}
          </select>

          <textarea
            value={newChannelNote}
            onChange={(e) => setNewChannelNote(e.target.value)}
            placeholder="첫 기록 메모 (선택) - 예) 시니어롱폼 소재용, 톤 비슷함"
            className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-lg outline-none resize-none"
            rows={2}
          />

          <div className="flex gap-2">
            <button onClick={cancelChannelPreview} className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold transition-colors">취소</button>
            <button onClick={handleSaveChannel} disabled={loading} className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors">채널 저장</button>
          </div>
          <p className="text-[10px] text-slate-500">채널을 클라우드 목록에 저장합니다. 영상 수집은 스캔 시 진행됩니다.</p>
        </div>
      )}
    </div>
  );
}
