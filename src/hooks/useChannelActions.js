import { useCallback } from 'react';
import { createChannel, createChannelNote, createChannelsBulk, removeChannel, updateChannel } from '../services/functionApi';
import {
  appendChannel,
  getChannelDeleteName,
  removeChannelById,
  removeSelectedChannelId,
  replaceChannel,
  shouldDeselectChannelAfterUpdate,
} from '../utils/channelActions';

const getChannelCloudActionError = (message, fallbackMessage, actionLabel = '저장') => {
  const baseMessage = message || fallbackMessage;
  if (baseMessage.includes('완료 처리하지 않았습니다')) return baseMessage;
  return `${baseMessage} Cloud 채널 ${actionLabel} 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.`;
};

export function useChannelActions({
  setSavedChannels,
  setSelectedChannelIds,
  setUpdatingChannelId,
  setError,
} = {}) {
  const saveChannel = useCallback(async ({ handle, tags, language, note }) => {
    try {
      const data = await createChannel({ handle, tags, language, note });
      if (!data.success) throw new Error(getChannelCloudActionError(data.error, '채널 추가에 실패했습니다.', '저장'));

      setSavedChannels(prev => appendChannel(prev, data.channel));
      return data.channel;
    } catch (err) {
      throw new Error(getChannelCloudActionError(err.message, '채널 추가에 실패했습니다.', '저장'));
    }
  }, [setSavedChannels]);

  const bulkCreateChannels = useCallback(async ({ handles, tags, language }) => {
    try {
      const data = await createChannelsBulk({ handles, tags, language });
      if (!data.success) throw new Error(getChannelCloudActionError(data.error, '일괄 추가에 실패했습니다.', '일괄 저장'));
      return data;
    } catch (err) {
      throw new Error(getChannelCloudActionError(err.message, '일괄 추가에 실패했습니다.', '일괄 저장'));
    }
  }, []);

  const deleteChannel = useCallback(async (id, category, title) => {
    const channelName = getChannelDeleteName(title);
    const confirmed = window.confirm(
      `'${channelName}' 채널을 Cloud 채널 목록에서 삭제할까요?\n\n삭제하면 저장 영상 조회와 새 영상 수집 대상에서 빠집니다. 나중에 다시 보려면 채널을 다시 추가해야 합니다.`
    );

    if (!confirmed) return;

    try {
      const data = await removeChannel({ id, category });
      if (!data.success) throw new Error(getChannelCloudActionError(data.error, '채널 삭제에 실패했습니다.', '삭제'));

      setSavedChannels(prev => removeChannelById(prev, id));
      setSelectedChannelIds(prev => removeSelectedChannelId(prev, id));
    } catch (err) {
      setError?.(getChannelCloudActionError(err.message, '채널 삭제에 실패했습니다.', '삭제'));
    }
  }, [setError, setSavedChannels, setSelectedChannelIds]);

  const updateChannelMetadata = useCallback(async (channel, updates) => {
    setUpdatingChannelId(channel.id);
    setError?.('');

    try {
      const data = await updateChannel({ id: channel.id, category: channel.category, updates });
      if (!data.success) throw new Error(getChannelCloudActionError(data.error, '채널 정보를 저장하지 못했습니다.', '정보 저장'));

      setSavedChannels(prev => replaceChannel(prev, data.channel));
      if (shouldDeselectChannelAfterUpdate(updates)) {
        setSelectedChannelIds(prev => removeSelectedChannelId(prev, data.channel.id));
      }
    } catch (err) {
      setError?.(getChannelCloudActionError(err.message, '채널 정보를 저장하지 못했습니다.', '정보 저장'));
    } finally {
      setUpdatingChannelId(null);
    }
  }, [setError, setSavedChannels, setSelectedChannelIds, setUpdatingChannelId]);

  const saveChannelNote = useCallback(async ({ id, category, text }) => {
    try {
      const data = await createChannelNote({ id, category, text });
      if (!data.success) throw new Error(getChannelCloudActionError(data.error, '기록 저장에 실패했습니다.', '메모 저장'));

      setSavedChannels(prev => replaceChannel(prev, data.channel));
      return data.channel;
    } catch (err) {
      throw new Error(getChannelCloudActionError(err.message, '기록 저장에 실패했습니다.', '메모 저장'));
    }
  }, [setSavedChannels]);

  return {
    saveChannel,
    bulkCreateChannels,
    deleteChannel,
    updateChannelMetadata,
    saveChannelNote,
  };
}
