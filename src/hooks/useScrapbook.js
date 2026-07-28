import { useEffect, useRef, useState } from 'react';
import { deleteScrapbookVideo, fetchScrapbook, saveScrapbookVideos } from '../services/scrapbookApi';
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from '../services/storage';
import { SCRAPBOOK_SYNC_WARNINGS } from '../constants/syncWarnings';
import {
  SCRAPBOOK_DELETE_FAILED_MESSAGE,
  SCRAPBOOK_LOAD_FAILED_MESSAGE,
  SCRAPBOOK_SAVE_FAILED_MESSAGE,
  getCloudScrapbookVideos,
  getNextScrapbookVideos,
  hasScrapbookVideo,
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

  const toggleScrapVideo = async (video) => {
    const isSaved = isVideoSaved(video.videoId);

    if (!scrapbookCloudReady) {
      setScrapbookSyncWarning(SCRAPBOOK_SYNC_WARNINGS.cloudRequired);
      return false;
    }

    try {
      if (isSaved) {
        const data = await deleteScrapbookVideo(video.videoId);
        if (!data.success) throw new Error(data.error || SCRAPBOOK_DELETE_FAILED_MESSAGE);
        const nextVideos = getNextScrapbookVideos(cloudScrapbookCacheRef.current, video, true);
        setSavedVideos(nextVideos);
        cacheCloudScrapbook(nextVideos);
      } else {
        const data = await saveScrapbookVideos([video]);
        if (!data.success) throw new Error(data.error || SCRAPBOOK_SAVE_FAILED_MESSAGE);
        const nextVideos = getNextScrapbookVideos(cloudScrapbookCacheRef.current, video, false);
        setSavedVideos(nextVideos);
        cacheCloudScrapbook(nextVideos);
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
    savedVideos,
    scrapbookSyncWarning,
    isVideoSaved,
    retryScrapbookSync: syncScrapbookFromCloud,
    toggleScrapVideo,
  };
}
