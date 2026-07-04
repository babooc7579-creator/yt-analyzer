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
  const summaryProps = {
    cancelChannelPreview,
    channelPreview,
  };

  const languageSelectProps = {
    language: newChannelLang,
    setLanguage: setNewChannelLang,
  };

  const noteFieldProps = {
    note: newChannelNote,
    setNote: setNewChannelNote,
  };

  const actionsProps = {
    cancelChannelPreview,
    handleSaveChannel,
    loading,
  };

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
