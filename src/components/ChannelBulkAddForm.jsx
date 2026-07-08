import { getChannelBulkTagSelectorLabel } from '../utils/channelAddCopy';
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
  const tagSelectorLabel = getChannelBulkTagSelectorLabel();
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
        label={tagSelectorLabel}
        selectedTags={newChannelTags}
        toggleTag={toggleNewChannelTag}
      />

      <ChannelLanguageSelect {...languageSelectProps} />

      <ChannelBulkSubmitButton {...submitButtonProps} />

      <ChannelBulkResultPanel {...resultPanelProps} />
    </div>
  );
}
