import { Loader2, Plus } from 'lucide-react';
import ChannelBulkInputBox from './ChannelBulkInputBox';
import ChannelBulkResultPanel from './ChannelBulkResultPanel';
import ChannelLanguageSelect from './ChannelLanguageSelect';
import ChannelTagSelector from './ChannelTagSelector';

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

      <ChannelTagSelector
        categories={categories}
        label="태그 선택 (전체 일괄 적용, 여러 개 가능)"
        selectedTags={newChannelTags}
        toggleTag={toggleNewChannelTag}
      />

      <ChannelLanguageSelect language={newChannelLang} setLanguage={setNewChannelLang} />

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
