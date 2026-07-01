import { useCallback, useEffect, useState } from 'react';
import { fetchChannels } from '../services/functionApi';

export function useCloudChannels({ onError } = {}) {
  const [savedChannels, setSavedChannels] = useState([]);
  const [channelsLoading, setChannelsLoading] = useState(true);

  const loadChannelsFromCloud = useCallback(async () => {
    setChannelsLoading(true);
    try {
      const data = await fetchChannels();
      if (!data.success) throw new Error(data.error || '채널 목록을 불러오지 못했습니다.');
      setSavedChannels(data.channels || []);
    } catch (err) {
      onError?.(`채널 목록 로딩 실패: ${err.message} (Function App CORS 설정을 확인해주세요)`);
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
