import { Loader2, Plus } from 'lucide-react';
import { LANGUAGES } from '../constants/languages';
import ChannelBulkInputBox from './ChannelBulkInputBox';
import ChannelBulkResultPanel from './ChannelBulkResultPanel';

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
      <ChannelBulkInputBox
        bulkInput={bulkInput}
        bulkLoading={bulkLoading}
        recognizedLineCount={recognizedLineCount}
        setBulkInput={setBulkInput}
      />

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

      <ChannelBulkResultPanel bulkResult={bulkResult} resetBulkAdd={resetBulkAdd} />
    </div>
  );
}
