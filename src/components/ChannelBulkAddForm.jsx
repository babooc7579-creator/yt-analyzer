import React from 'react';
import { Loader2, Plus } from 'lucide-react';
import { LANGUAGES } from '../constants/languages';

export default function ChannelBulkAddForm({
  bulkInput,
  setBulkInput,
  bulkLoading,
  bulkResult,
  resetBulkAdd,
  handleBulkAdd,
  categories,
  newChannelTags,
  toggleNewChannelTag,
  newChannelLang,
  setNewChannelLang,
}) {
  const recognizedLineCount = bulkInput.split('\n').map((line) => line.trim()).filter(Boolean).length;

  return (
    <div className="space-y-2 animate-in fade-in duration-200">
      <textarea
        value={bulkInput}
        onChange={(event) => setBulkInput(event.target.value)}
        placeholder={'핸들 / 채널링크 / 영상링크를 한 줄에 하나씩 붙여넣으세요\n예)\n@channel1\nhttps://youtube.com/@channel2\nhttps://youtu.be/xxxxxxxxxxx'}
        className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-lg outline-none resize-none font-mono text-xs"
        rows={5}
        disabled={bulkLoading}
        aria-label="일괄 추가할 채널 목록"
      />
      <p className="text-[10px] text-slate-500">{recognizedLineCount}개 줄 인식됨. YouTube에서 채널 정보를 확인한 뒤 클라우드 목록에 저장합니다. 영상 수집은 하지 않습니다.</p>

      <div>
        <p className="text-[10px] text-slate-500 mb-1">태그 선택 (전체 일괄 적용, 여러 개 가능)</p>
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
          {bulkResult.results.filter((result) => !result.success).map((result, index) => (
            <p key={index} className="text-red-500 truncate">✗ {result.handle}: {result.error}</p>
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
  );
}
