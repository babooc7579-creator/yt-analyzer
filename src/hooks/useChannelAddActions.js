import { fetchChannelPreview } from '../services/channelApi';
import {
  BULK_CHANNEL_EMPTY_INPUT_MESSAGE,
  BULK_CHANNEL_SAVE_ACTION_LABEL,
  CHANNEL_PREVIEW_DUPLICATE_MESSAGE,
  CHANNEL_PREVIEW_LOAD_FAILED_MESSAGE,
  CHANNEL_SAVE_ACTION_LABEL,
  getBulkChannelCreatePayload,
  getBulkChannelHandles,
  getBulkChannelSaveCompleteMessage,
  getBulkChannelSaveStartMessage,
  getChannelSaveCompleteMessage,
  getChannelSaveFailureMessage,
  getChannelSaveStartMessage,
  getChannelCreatePayload,
  getTrimmedChannelInput,
  isDuplicateChannel,
} from '../utils/channelAddActions';

export function useChannelAddActions({
  bulkCreateChannels,
  bulkInput,
  cancelChannelPreview,
  channelPreview,
  loadChannelsFromCloud,
  newChannelInput,
  newChannelLang,
  newChannelNote,
  newChannelTags,
  savedChannels,
  saveChannel,
  setBulkLoading,
  setBulkResult,
  setChannelPreview,
  setError,
  setLoading,
  setPreviewLoading,
  setProgressMsg,
  setSelectedCategoryTab,
}) {
  const handlePreviewChannel = async () => {
    const channelInput = getTrimmedChannelInput(newChannelInput);
    if (!channelInput) return;

    setPreviewLoading(true);
    setError('');
    setChannelPreview(null);

    try {
      const data = await fetchChannelPreview(channelInput);
      if (!data.success) throw new Error(data.error || CHANNEL_PREVIEW_LOAD_FAILED_MESSAGE);

      if (isDuplicateChannel(savedChannels, data.channel.id)) {
        setError(CHANNEL_PREVIEW_DUPLICATE_MESSAGE);
      } else {
        setChannelPreview(data.channel);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSaveChannel = async () => {
    if (!channelPreview) return;

    setLoading(true);
    setError('');
    setProgressMsg(getChannelSaveStartMessage());

    try {
      await saveChannel(getChannelCreatePayload({
        handle: newChannelInput,
        tags: newChannelTags,
        language: newChannelLang,
        note: newChannelNote,
      }));

      if (newChannelTags[0]) setSelectedCategoryTab(newChannelTags[0]);
      setProgressMsg(getChannelSaveCompleteMessage());
      cancelChannelPreview();
    } catch (err) {
      setError(getChannelSaveFailureMessage(err, CHANNEL_SAVE_ACTION_LABEL));
    } finally {
      setLoading(false);
      setTimeout(() => setProgressMsg(''), 4000);
    }
  };

  const handleBulkAdd = async () => {
    const handles = getBulkChannelHandles(bulkInput);
    if (handles.length === 0) {
      setError(BULK_CHANNEL_EMPTY_INPUT_MESSAGE);
      return;
    }

    setBulkLoading(true);
    setError('');
    setBulkResult(null);
    setProgressMsg(getBulkChannelSaveStartMessage(handles.length));

    try {
      const data = await bulkCreateChannels(getBulkChannelCreatePayload({
        handles,
        tags: newChannelTags,
        language: newChannelLang,
      }));

      setBulkResult(data);
      if (newChannelTags[0]) setSelectedCategoryTab(newChannelTags[0]);
      setProgressMsg(getBulkChannelSaveCompleteMessage(data));
      await loadChannelsFromCloud();
    } catch (err) {
      setError(getChannelSaveFailureMessage(err, BULK_CHANNEL_SAVE_ACTION_LABEL));
    } finally {
      setBulkLoading(false);
      setTimeout(() => setProgressMsg(''), 5000);
    }
  };

  return {
    handleBulkAdd,
    handlePreviewChannel,
    handleSaveChannel,
  };
}
