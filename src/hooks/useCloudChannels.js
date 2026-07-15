import { useCallback, useEffect, useState } from 'react';
import { fetchChannels } from '../services/channelApi';
import { CHANNEL_LOAD_FAILED_MESSAGE, getChannelLoadErrorMessage } from '../utils/channelActions';

export function useCloudChannels({ onError } = {}) {
  const [savedChannels, setSavedChannels] = useState([]);
  const [channelsLoading, setChannelsLoading] = useState(true);

  const loadChannelsFromCloud = useCallback(async () => {
    setChannelsLoading(true);
    try {
      const data = await fetchChannels();
      if (!data.success) throw new Error(data.error || CHANNEL_LOAD_FAILED_MESSAGE);
      const channels = data.channels || [];
      setSavedChannels(channels);
      return { success: true, channels };
    } catch (err) {
      const message = getChannelLoadErrorMessage(err);
      onError?.(message);
      return { success: false, error: message };
    } finally {
      setChannelsLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    loadChannelsFromCloud();
  }, [loadChannelsFromCloud]);

  return {
    savedChannels,
    setSavedChannels,
    channelsLoading,
    loadChannelsFromCloud,
  };
}
