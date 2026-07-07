import { getChannelSingleAddFormInnerProps } from '../utils/channelAddFormProps';
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
  const {
    previewEditorProps,
    previewInputProps,
  } = getChannelSingleAddFormInnerProps({
    cancelChannelPreview,
    categories,
    channelPreview,
    handlePreviewChannel,
    handleSaveChannel,
    loading,
    newChannelInput,
    newChannelLang,
    newChannelNote,
    newChannelTags,
    previewLoading,
    setNewChannelInput,
    setNewChannelLang,
    setNewChannelNote,
    toggleNewChannelTag,
  });

  if (!channelPreview) {
    return (
      <ChannelPreviewInput {...previewInputProps} />
    );
  }

  return (
    <ChannelPreviewEditor {...previewEditorProps} />
  );
}
