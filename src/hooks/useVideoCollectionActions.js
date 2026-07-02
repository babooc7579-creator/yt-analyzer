import {
  fetchStoredVideosByChannelIds,
  scanChannels,
  scanSelectedChannels as scanSelectedChannelsRequest,
} from '../services/functionApi';
import {
  getScanCompleteMessage,
  getScanRequestContext,
  getScanStartMessage,
  getStoredVideosLoadedMessage,
  mapStoredVideosToViewModels,
} from '../utils/videoCollection';

export function useVideoCollectionActions({
  clearCheckedVideos,
  loadChannelsFromCloud,
  savedChannels,
  selectedChannelIds,
  setActiveTab,
  setError,
  setIsScanning,
  setLoading,
  setProgressMsg,
  setScanningTag,
  setVideos,
}) {
  const loadStoredVideosForSelectedChannels = async () => {
    if (selectedChannelIds.length === 0) {
      setError('저장된 영상을 불러올 채널을 하나 이상 선택해 주세요. 이 작업은 DB 조회이며 새 영상 수집은 실행하지 않습니다.');
      return;
    }

    setLoading(true);
    setError('');
    setVideos([]);
    clearCheckedVideos();
    setActiveTab('dashboard');
    setProgressMsg('클라우드 DB에 저장된 영상만 불러오는 중입니다. YouTube API를 새로 호출하지 않습니다.');

    try {
      const data = await fetchStoredVideosByChannelIds(selectedChannelIds);
      if (!data.success) throw new Error(data.error || '클라우드 DB의 저장 영상을 불러오지 못했습니다.');

      const mapped = mapStoredVideosToViewModels(data.videos || []);

      setVideos(mapped);
      setProgressMsg(getStoredVideosLoadedMessage(mapped.length));
      setTimeout(() => setProgressMsg(''), 3000);
    } catch (err) {
      setError(`${err.message} (Function App CORS 설정을 확인해주세요)`);
      setProgressMsg('');
    } finally {
      setLoading(false);
    }
  };

  const runScanRequest = async (tag) => {
    const scanContext = getScanRequestContext({ tag, selectedChannelIds, savedChannels });

    if (scanContext.scanSelectedChannels && scanContext.channelIdsForScan.length === 0) {
      setError('운영중 상태의 채널을 하나 이상 선택해 주세요. 보류/제외 채널은 새 영상 수집에서 제외됩니다.');
      return;
    }

    setIsScanning(true);
    setScanningTag(scanContext.scanningTag);
    setError('');
    setProgressMsg(getScanStartMessage({ ...scanContext, tag }));

    try {
      const data = scanContext.scanSelectedChannels
        ? await scanSelectedChannelsRequest(scanContext.channelIdsForScan)
        : await scanChannels({ tag });
      if (!data.success) throw new Error(data.error || '스캔에 실패했습니다.');

      setProgressMsg(getScanCompleteMessage(data.results || []));

      await loadChannelsFromCloud();
      if (selectedChannelIds.length > 0) await loadStoredVideosForSelectedChannels();
    } catch (err) {
      setError(`스캔 실패: ${err.message}`);
    } finally {
      setIsScanning(false);
      setScanningTag(null);
      setTimeout(() => setProgressMsg(''), 5000);
    }
  };

  return {
    handleManualScan: () => runScanRequest(null),
    handleTagScan: (tag) => runScanRequest(tag),
    loadStoredVideosForSelectedChannels,
  };
}
