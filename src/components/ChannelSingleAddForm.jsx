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
  const previewInputProps = {
    handlePreviewChannel,
    newChannelInput,
    previewLoading,
    setNewChannelInput,
  };

  const previewEditorProps = {
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
  };

  if (!channelPreview) {
    return (
      <ChannelPreviewInput {...previewInputProps} />
    );
  }

  return (
    <ChannelPreviewEditor {...previewEditorProps} />
  );
}
