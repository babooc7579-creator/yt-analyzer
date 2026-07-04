import ChannelBulkInputBox from './ChannelBulkInputBox';
import ChannelBulkResultPanel from './ChannelBulkResultPanel';
import ChannelBulkSubmitButton from './ChannelBulkSubmitButton';
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

      <ChannelBulkSubmitButton
        bulkInput={bulkInput}
        bulkLoading={bulkLoading}
        handleBulkAdd={handleBulkAdd}
      />

      <ChannelBulkResultPanel bulkResult={bulkResult} resetBulkAdd={resetBulkAdd} />
    </div>
  );
}
