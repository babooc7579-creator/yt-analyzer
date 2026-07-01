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

  const deleteChannel = useCallback(async (id, category) => {
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
