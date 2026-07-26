import {
  fetchAllStoredVideosByChannelIds,
} from '../services/videoRecordsApi';
import {
  scanChannels,
  scanSelectedChannels as scanSelectedChannelsRequest,
} from '../services/scanApi';
import {
  SCAN_FAILED_MESSAGE,
  SCAN_NO_SCANNABLE_CHANNEL_SELECTED_MESSAGE,
  STORED_VIDEO_LOAD_FAILED_MESSAGE,
  STORED_VIDEO_NO_CHANNEL_SELECTED_MESSAGE,
  getScanCompleteMessage,
  getScanErrorMessage,
  getScanRequestContext,
  getScanStartMessage,
  getStoredVideoLoadErrorMessage,
  getStoredVideoLoadProgressMessage,
  getStoredVideoLoadStartMessage,
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
  const clearProgressMessageAfter = (delay) => {
    setTimeout(() => setProgressMsg(''), delay);
  };

  const prepareStoredVideoLoad = () => {
    setLoading(true);
    setError('');
    setVideos([]);
    clearCheckedVideos();
    setActiveTab('dashboard');
    setProgressMsg(getStoredVideoLoadStartMessage());
  };

  const finishStoredVideoLoad = (videos, pageCount, elapsedMs) => {
    setVideos(videos);
    setProgressMsg(getStoredVideosLoadedMessage(videos.length, pageCount, elapsedMs));
    clearProgressMessageAfter(3000);
  };

  const prepareScan = (scanContext, tag) => {
    setIsScanning(true);
    setScanningTag(scanContext.scanningTag);
    setError('');
    setProgressMsg(getScanStartMessage({ ...scanContext, tag }));
  };

  const finishScan = () => {
    setIsScanning(false);
    setScanningTag(null);
    clearProgressMessageAfter(5000);
  };

  const loadStoredVideosForSelectedChannels = async () => {
    if (selectedChannelIds.length === 0) {
      setError(STORED_VIDEO_NO_CHANNEL_SELECTED_MESSAGE);
      return { success: false, videoCount: 0 };
    }

    prepareStoredVideoLoad();
    const loadStartedAt = Date.now();

    try {
      const data = await fetchAllStoredVideosByChannelIds(selectedChannelIds, {
        onPage: (progress) => {
          setProgressMsg(getStoredVideoLoadProgressMessage({
            ...progress,
            elapsedMs: Date.now() - loadStartedAt,
          }));
        },
      });
      if (!data.success) throw new Error(data.error || STORED_VIDEO_LOAD_FAILED_MESSAGE);

      const mapped = mapStoredVideosToViewModels(data.videos || []);

      finishStoredVideoLoad(mapped, data.pageCount, Date.now() - loadStartedAt);
      return { success: true, videoCount: mapped.length };
    } catch (err) {
      setError(getStoredVideoLoadErrorMessage(err));
      setProgressMsg('');
      return { success: false, videoCount: 0 };
    } finally {
      setLoading(false);
    }
  };

  const runScanRequest = async (tag) => {
    const scanContext = getScanRequestContext({ tag, selectedChannelIds, savedChannels });

    if (scanContext.scanSelectedChannels && scanContext.channelIdsForScan.length === 0) {
      setError(SCAN_NO_SCANNABLE_CHANNEL_SELECTED_MESSAGE);
      return;
    }

    prepareScan(scanContext, tag);

    try {
      const data = scanContext.scanSelectedChannels
        ? await scanSelectedChannelsRequest(scanContext.channelIdsForScan)
        : await scanChannels({ tag });
      if (!data.success) throw new Error(data.error || SCAN_FAILED_MESSAGE);

      setProgressMsg(getScanCompleteMessage(data.results || []));

      await loadChannelsFromCloud();
      if (selectedChannelIds.length > 0) await loadStoredVideosForSelectedChannels();
    } catch (err) {
      setError(getScanErrorMessage(err));
    } finally {
      finishScan();
    }
  };

  return {
    handleManualScan: () => runScanRequest(null),
    handleTagScan: (tag) => runScanRequest(tag),
    loadStoredVideosForSelectedChannels,
  };
}
