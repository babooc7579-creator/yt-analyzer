import { useCallback, useEffect, useState } from 'react';
import { fetchChannels } from '../services/functionApi';

const getChannelLoadErrorMessage = (error) => {
  const message = error?.message || '채널 목록을 불러오지 못했습니다.';
  return `${message} Cloud 채널 목록 조회를 완료하지 못했습니다. 조회가 성공할 때까지 화면의 채널 목록을 기준 데이터로 보지 않습니다. 연결을 확인한 뒤 다시 시도해주세요.`;
};

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
      onError?.(getChannelLoadErrorMessage(err));
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
