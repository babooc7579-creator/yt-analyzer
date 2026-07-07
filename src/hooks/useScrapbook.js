import { useEffect, useRef, useState } from 'react';
import { deleteScrapbookVideo, fetchScrapbook, saveScrapbookVideos } from '../services/scrapbookApi';
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from '../services/storage';
import { SCRAPBOOK_SYNC_WARNINGS } from '../constants/syncWarnings';
import {
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

  useEffect(() => {
    let isCancelled = false;

    const syncScrapbookFromCloud = async () => {
      try {
        const data = await fetchScrapbook();
        if (!data.success) throw new Error(data.error || '스크랩북을 불러오지 못했습니다.');
        if (isCancelled) return;

        const cloudVideos = getCloudScrapbookVideos(data.videos);
        setSavedVideos(cloudVideos);
        cacheCloudScrapbook(cloudVideos);
        setScrapbookCloudReady(true);
        setScrapbookSyncWarning('');
      } catch {
        if (!isCancelled) {
          const fallbackVideos = getCloudScrapbookVideos(readJsonStorage(STORAGE_KEYS.savedVideos, []));
          setSavedVideos(fallbackVideos);
          setScrapbookCloudReady(false);
          setScrapbookSyncWarning(SCRAPBOOK_SYNC_WARNINGS.loadFallback);
        }
      }
    };

    syncScrapbookFromCloud();
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
        if (!data.success) throw new Error(data.error || '스크랩북에서 삭제하지 못했습니다.');
        const nextVideos = getNextScrapbookVideos(cloudScrapbookCacheRef.current, video, true);
        setSavedVideos(nextVideos);
        cacheCloudScrapbook(nextVideos);
      } else {
        const data = await saveScrapbookVideos([video]);
        if (!data.success) throw new Error(data.error || '스크랩북에 저장하지 못했습니다.');
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
    toggleScrapVideo,
  };
}
