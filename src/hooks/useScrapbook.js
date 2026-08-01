import { useEffect, useRef, useState } from 'react';
import { deleteScrapbookVideo, fetchScrapbook, saveScrapbookVideos } from '../services/scrapbookApi';
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from '../services/storage';
import { SCRAPBOOK_SYNC_WARNINGS } from '../constants/syncWarnings';
import {
  SCRAPBOOK_DELETE_FAILED_MESSAGE,
  SCRAPBOOK_LOAD_FAILED_MESSAGE,
  SCRAPBOOK_SAVE_FAILED_MESSAGE,
  getCloudScrapbookVideos,
  getMaterialScrapbookVideos,
  getNextScrapbookVideos,
  hasScrapbookVideo,
  SCRAPBOOK_PURPOSE,
  withScrapbookPurpose,
  withoutScrapbookPurpose,
  upsertScrapbookVideo,
} from '../utils/scrapbook';

export function useScrapbook() {
  const cloudScrapbookCacheRef = useRef([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const [scrapbookCloudReady, setScrapbookCloudReady] = useState(false);
  const [scrapbookSyncWarning, setScrapbookSyncWarning] = useState('');

  const cacheCloudScrapbook = (videos) => {
    cloudScrapbookCacheRef.current = videos;
    writeJsonStorage(STORAGE_KEYS.savedVideos, videos);
  };

  const syncScrapbookFromCloud = async ({ isCancelled = () => false } = {}) => {
    try {
      const data = await fetchScrapbook();
      if (!data.success) throw new Error(data.error || SCRAPBOOK_LOAD_FAILED_MESSAGE);
      if (isCancelled()) return false;

      const cloudVideos = getCloudScrapbookVideos(data.videos);
      setSavedVideos(cloudVideos);
      cacheCloudScrapbook(cloudVideos);
      setScrapbookCloudReady(true);
      setScrapbookSyncWarning('');
      return true;
    } catch {
      if (!isCancelled()) {
        const fallbackVideos = getCloudScrapbookVideos(readJsonStorage(STORAGE_KEYS.savedVideos, []));
        setSavedVideos(fallbackVideos);
        setScrapbookCloudReady(false);
        setScrapbookSyncWarning(SCRAPBOOK_SYNC_WARNINGS.loadFallback);
      }
      return false;
    }
  };

  useEffect(() => {
    let isCancelled = false;
    syncScrapbookFromCloud({ isCancelled: () => isCancelled });
    return () => { isCancelled = true; };
  }, []);

  const isVideoSaved = (videoId) => hasScrapbookVideo(savedVideos, videoId);

  const saveScrapbookVideo = async (video) => {
    const data = await saveScrapbookVideos([video]);
    if (!data.success) throw new Error(data.error || SCRAPBOOK_SAVE_FAILED_MESSAGE);
    const nextVideos = upsertScrapbookVideo(cloudScrapbookCacheRef.current, video);
    setSavedVideos(nextVideos);
    cacheCloudScrapbook(nextVideos);
  };

  const ensureProductionVideoSource = async (video) => {
    if (!scrapbookCloudReady) {
      setScrapbookSyncWarning(SCRAPBOOK_SYNC_WARNINGS.cloudRequired);
      return false;
    }

    const existingVideo = cloudScrapbookCacheRef.current.find(item => item?.videoId === video?.videoId);
    const sourceVideo = withScrapbookPurpose(
      existingVideo
        ? { ...existingVideo, ...(video || {}) }
        : { ...(video || {}), scrapbookPurposes: [] },
      SCRAPBOOK_PURPOSE.PRODUCTION,
    );

    try {
      await saveScrapbookVideo(sourceVideo);
      setScrapbookSyncWarning('');
      return true;
    } catch {
      setScrapbookCloudReady(false);
      setScrapbookSyncWarning(SCRAPBOOK_SYNC_WARNINGS.saveFailed);
      return false;
    }
  };

  const toggleScrapVideo = async (video, { preserveForProduction = false } = {}) => {
    const isSaved = isVideoSaved(video.videoId);

    if (!scrapbookCloudReady) {
      setScrapbookSyncWarning(SCRAPBOOK_SYNC_WARNINGS.cloudRequired);
      return false;
    }

    try {
      if (isSaved) {
        if (preserveForProduction) {
          const existingVideo = cloudScrapbookCacheRef.current.find(item => item?.videoId === video.videoId) || video;
          const productionVideo = withScrapbookPurpose(
            withoutScrapbookPurpose(existingVideo, SCRAPBOOK_PURPOSE.MATERIAL),
            SCRAPBOOK_PURPOSE.PRODUCTION,
          );
          await saveScrapbookVideo(productionVideo);
        } else {
          const data = await deleteScrapbookVideo(video.videoId);
          if (!data.success) throw new Error(data.error || SCRAPBOOK_DELETE_FAILED_MESSAGE);
          const nextVideos = getNextScrapbookVideos(cloudScrapbookCacheRef.current, video, true);
          setSavedVideos(nextVideos);
          cacheCloudScrapbook(nextVideos);
        }
      } else {
        const existingVideo = cloudScrapbookCacheRef.current.find(item => item?.videoId === video.videoId);
        await saveScrapbookVideo(withScrapbookPurpose({
          ...(existingVideo || {}),
          ...video,
        }, SCRAPBOOK_PURPOSE.MATERIAL));
      }
      setScrapbookSyncWarning('');
      return true;
    } catch {
      setScrapbookCloudReady(false);
      setScrapbookSyncWarning(SCRAPBOOK_SYNC_WARNINGS.saveFailed);
      return false;
    }
  };

  return {
    ensureProductionVideoSource,
    productionSourceVideos: getCloudScrapbookVideos(savedVideos),
    savedVideos: getMaterialScrapbookVideos(savedVideos),
    scrapbookSyncWarning,
    isVideoSaved,
    retryScrapbookSync: syncScrapbookFromCloud,
    toggleScrapVideo,
  };
}
