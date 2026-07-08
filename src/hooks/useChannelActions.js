import { useCallback } from 'react';
import { createChannel, createChannelNote, createChannelsBulk, removeChannel, updateChannel } from '../services/channelApi';
import {
  CHANNEL_ACTION_COPY,
  appendChannel,
  getChannelCloudActionError,
  getChannelDeleteConfirmMessage,
  removeChannelById,
  removeSelectedChannelId,
  replaceChannel,
  shouldDeselectChannelAfterUpdate,
} from '../utils/channelActions';

const getActionError = (message, actionCopy) => getChannelCloudActionError(
  message,
  actionCopy.failureMessage,
  actionCopy.actionLabel,
);

export function useChannelActions({
  setSavedChannels,
  setSelectedChannelIds,
  setUpdatingChannelId,
  setError,
} = {}) {
  const saveChannel = useCallback(async ({ handle, tags, language, note }) => {
    try {
      const data = await createChannel({ handle, tags, language, note });
      if (!data.success) {
        throw new Error(getActionError(data.error, CHANNEL_ACTION_COPY.add));
      }

      setSavedChannels(prev => appendChannel(prev, data.channel));
      return data.channel;
    } catch (err) {
      throw new Error(getActionError(err.message, CHANNEL_ACTION_COPY.add));
    }
  }, [setSavedChannels]);

  const bulkCreateChannels = useCallback(async ({ handles, tags, language }) => {
    try {
      const data = await createChannelsBulk({ handles, tags, language });
      if (!data.success) {
        throw new Error(getActionError(data.error, CHANNEL_ACTION_COPY.bulkAdd));
      }
      return data;
    } catch (err) {
      throw new Error(getActionError(err.message, CHANNEL_ACTION_COPY.bulkAdd));
    }
  }, []);

  const deleteChannel = useCallback(async (id, category, title) => {
    const confirmed = window.confirm(getChannelDeleteConfirmMessage(title));

    if (!confirmed) return;

    try {
      const data = await removeChannel({ id, category });
      if (!data.success) {
        throw new Error(getActionError(data.error, CHANNEL_ACTION_COPY.delete));
      }

      setSavedChannels(prev => removeChannelById(prev, id));
      setSelectedChannelIds(prev => removeSelectedChannelId(prev, id));
    } catch (err) {
      setError?.(getActionError(err.message, CHANNEL_ACTION_COPY.delete));
    }
  }, [setError, setSavedChannels, setSelectedChannelIds]);

  const updateChannelMetadata = useCallback(async (channel, updates) => {
    setUpdatingChannelId(channel.id);
    setError?.('');

    try {
      const data = await updateChannel({ id: channel.id, category: channel.category, updates });
      if (!data.success) {
        throw new Error(getActionError(data.error, CHANNEL_ACTION_COPY.metadata));
      }

      setSavedChannels(prev => replaceChannel(prev, data.channel));
      if (shouldDeselectChannelAfterUpdate(updates)) {
        setSelectedChannelIds(prev => removeSelectedChannelId(prev, data.channel.id));
      }
    } catch (err) {
      setError?.(getActionError(err.message, CHANNEL_ACTION_COPY.metadata));
    } finally {
      setUpdatingChannelId(null);
    }
  }, [setError, setSavedChannels, setSelectedChannelIds, setUpdatingChannelId]);

  const saveChannelNote = useCallback(async ({ id, category, text }) => {
    try {
      const data = await createChannelNote({ id, category, text });
      if (!data.success) {
        throw new Error(getActionError(data.error, CHANNEL_ACTION_COPY.note));
      }

      setSavedChannels(prev => replaceChannel(prev, data.channel));
      return data.channel;
    } catch (err) {
      throw new Error(getActionError(err.message, CHANNEL_ACTION_COPY.note));
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
