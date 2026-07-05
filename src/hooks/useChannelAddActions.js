import { fetchChannelPreview } from '../services/channelApi';
import {
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
      if (!data.success) throw new Error(data.error || '채널을 불러오지 못했습니다.');

      if (isDuplicateChannel(savedChannels, data.channel.id)) {
        setError('이미 등록된 채널입니다.');
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
      setError(getChannelSaveFailureMessage(err, '저장'));
    } finally {
      setLoading(false);
      setTimeout(() => setProgressMsg(''), 4000);
    }
  };

  const handleBulkAdd = async () => {
    const handles = getBulkChannelHandles(bulkInput);
    if (handles.length === 0) {
      setError('등록할 채널을 한 줄에 하나씩 입력해 주세요.');
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
      setError(getChannelSaveFailureMessage(err, '일괄 저장'));
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
