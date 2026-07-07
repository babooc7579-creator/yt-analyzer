import { getChannelBulkAddFormInnerProps } from '../utils/channelAddFormProps';
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
  const {
    inputBoxProps,
    languageSelectProps,
    resultPanelProps,
    submitButtonProps,
  } = getChannelBulkAddFormInnerProps({
    bulkInput,
    bulkLoading,
    bulkResult,
    handleBulkAdd,
    newChannelLang,
    resetBulkAdd,
    setBulkInput,
    setNewChannelLang,
  });

  return (
    <div className="space-y-2 animate-in fade-in duration-200">
      <ChannelBulkInputBox {...inputBoxProps} />

      <ChannelTagSelector
        categories={categories}
        label="태그 선택 (전체 일괄 적용, 여러 개 가능)"
        selectedTags={newChannelTags}
        toggleTag={toggleNewChannelTag}
      />

      <ChannelLanguageSelect {...languageSelectProps} />

      <ChannelBulkSubmitButton {...submitButtonProps} />

      <ChannelBulkResultPanel {...resultPanelProps} />
    </div>
  );
}
