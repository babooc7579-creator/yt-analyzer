import { getChannelPreviewEditorProps } from '../utils/channelAddFormProps';
import ChannelLanguageSelect from './ChannelLanguageSelect';
import ChannelPreviewActions from './ChannelPreviewActions';
import ChannelPreviewNoteField from './ChannelPreviewNoteField';
import ChannelPreviewSaveNotice from './ChannelPreviewSaveNotice';
import ChannelPreviewSummary from './ChannelPreviewSummary';
import ChannelTagSelector from './ChannelTagSelector';

export default function ChannelPreviewEditor({
  cancelChannelPreview,
  categories,
  channelPreview,
  handleSaveChannel,
  loading,
  newChannelLang,
  newChannelNote,
  newChannelTags,
  setNewChannelLang,
  setNewChannelNote,
  toggleNewChannelTag,
}) {
  const {
    actionsProps,
    languageSelectProps,
    noteFieldProps,
    summaryProps,
  } = getChannelPreviewEditorProps({
    cancelChannelPreview,
    channelPreview,
    handleSaveChannel,
    loading,
    newChannelLang,
    newChannelNote,
    setNewChannelLang,
    setNewChannelNote,
  });

  return (
    <div className="space-y-2 animate-in fade-in duration-200">
      <ChannelPreviewSummary {...summaryProps} />

      <ChannelTagSelector
        categories={categories}
        label="태그 선택 (여러 개 가능, 안 골라도 OK)"
        selectedTags={newChannelTags}
        toggleTag={toggleNewChannelTag}
      />

      <ChannelLanguageSelect {...languageSelectProps} />

      <ChannelPreviewNoteField {...noteFieldProps} />

      <ChannelPreviewActions {...actionsProps} />
      <ChannelPreviewSaveNotice />
    </div>
  );
}
