import React from 'react';
import { Loader2, X } from 'lucide-react';
import { LANGUAGES } from '../constants/languages';

export default function ChannelSingleAddForm({
  categories,
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
  if (!channelPreview) {
    return (
      <div className="space-y-1.5">
        <div className="flex gap-2">
          <input
            type="text"
            value={newChannelInput}
            onChange={(event) => setNewChannelInput(event.target.value)}
            placeholder="핸들 / 채널링크 / 영상링크"
            className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-lg outline-none"
            aria-label="확인할 채널 핸들, 채널 링크 또는 영상 링크"
            onKeyDown={(event) => event.key === 'Enter' && handlePreviewChannel()}
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
    );
  }

  return (
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
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => toggleNewChannelTag(category)}
              className={`px-2 py-1 rounded-full text-[11px] font-semibold border transition-colors ${newChannelTags.includes(category) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
              title={`${category} 태그 ${newChannelTags.includes(category) ? '선택 해제' : '선택'}`}
              aria-label={`${category} 태그 ${newChannelTags.includes(category) ? '선택 해제' : '선택'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <select
        value={newChannelLang}
        onChange={(event) => setNewChannelLang(event.target.value)}
        className="w-full text-sm px-2 py-2 bg-white border border-indigo-200 rounded-lg outline-none cursor-pointer font-medium"
        title="채널 기본 언어 선택"
        aria-label="채널 기본 언어 선택"
      >
        {LANGUAGES.map((language) => <option key={language.code} value={language.code}>{language.label}</option>)}
      </select>

      <textarea
        value={newChannelNote}
        onChange={(event) => setNewChannelNote(event.target.value)}
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
  );
}
