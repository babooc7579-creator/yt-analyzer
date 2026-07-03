import { useCallback } from 'react';
import { createChannel, createChannelNote, createChannelsBulk, removeChannel, updateChannel } from '../services/functionApi';
import { CHANNEL_STATUS } from '../constants/status';

export function useChannelActions({
  setSavedChannels,
  setSelectedChannelIds,
  setUpdatingChannelId,
  setError,
} = {}) {
  const saveChannel = useCallback(async ({ handle, tags, language, note }) => {
    const data = await createChannel({ handle, tags, language, note });
    if (!data.success) throw new Error(data.error || '채널 추가에 실패했습니다.');

    setSavedChannels(prev => [...prev, data.channel]);
    return data.channel;
  }, [setSavedChannels]);

  const bulkCreateChannels = useCallback(async ({ handles, tags, language }) => {
    const data = await createChannelsBulk({ handles, tags, language });
    if (!data.success) throw new Error(data.error || '일괄 추가에 실패했습니다.');
    return data;
  }, []);

  const deleteChannel = useCallback(async (id, category, title) => {
    const channelName = title || '이 채널';
    const confirmed = window.confirm(
      `'${channelName}' 채널을 Cloud 채널 목록에서 삭제할까요?\n\n삭제하면 저장 영상 조회와 새 영상 수집 대상에서 빠집니다. 나중에 다시 보려면 채널을 다시 추가해야 합니다.`
    );

    if (!confirmed) return;

    try {
      const data = await removeChannel({ id, category });
      if (!data.success) throw new Error(data.error || '채널 삭제에 실패했습니다.');

      setSavedChannels(prev => prev.filter(channel => channel.id !== id));
      setSelectedChannelIds(prev => prev.filter(channelId => channelId !== id));
    } catch (err) {
      setError?.(err.message);
    }
  }, [setError, setSavedChannels, setSelectedChannelIds]);

  const updateChannelMetadata = useCallback(async (channel, updates) => {
    setUpdatingChannelId(channel.id);
    setError?.('');

    try {
      const data = await updateChannel({ id: channel.id, category: channel.category, updates });
      if (!data.success) throw new Error(data.error || '채널 정보를 저장하지 못했습니다.');

      setSavedChannels(prev => prev.map(current => (current.id === data.channel.id ? data.channel : current)));
      if (updates.status && updates.status !== CHANNEL_STATUS.ACTIVE) {
        setSelectedChannelIds(prev => prev.filter(id => id !== data.channel.id));
      }
    } catch (err) {
      setError?.(err.message);
    } finally {
      setUpdatingChannelId(null);
    }
  }, [setError, setSavedChannels, setSelectedChannelIds, setUpdatingChannelId]);

  const saveChannelNote = useCallback(async ({ id, category, text }) => {
    const data = await createChannelNote({ id, category, text });
    if (!data.success) throw new Error(data.error || '기록 저장에 실패했습니다.');

    setSavedChannels(prev => prev.map(channel => (channel.id === data.channel.id ? data.channel : channel)));
    return data.channel;
  }, [setSavedChannels]);

  return {
    saveChannel,
    bulkCreateChannels,
    deleteChannel,
    updateChannelMetadata,
    saveChannelNote,
  };
}
