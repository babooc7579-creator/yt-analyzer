import ChannelPreviewEditor from './ChannelPreviewEditor';
import ChannelPreviewInput from './ChannelPreviewInput';

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
      <ChannelPreviewInput
        handlePreviewChannel={handlePreviewChannel}
        newChannelInput={newChannelInput}
        previewLoading={previewLoading}
        setNewChannelInput={setNewChannelInput}
      />
    );
  }

  return (
    <ChannelPreviewEditor
      cancelChannelPreview={cancelChannelPreview}
      categories={categories}
      channelPreview={channelPreview}
      handleSaveChannel={handleSaveChannel}
      loading={loading}
      newChannelLang={newChannelLang}
      newChannelNote={newChannelNote}
      newChannelTags={newChannelTags}
      setNewChannelLang={setNewChannelLang}
      setNewChannelNote={setNewChannelNote}
      toggleNewChannelTag={toggleNewChannelTag}
    />
  );
}
