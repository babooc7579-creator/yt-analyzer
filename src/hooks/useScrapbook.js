import { useEffect, useState } from 'react';
import { deleteScrapbookVideo, fetchScrapbook, saveScrapbookVideos } from '../services/functionApi';
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from '../services/storage';

export function useScrapbook() {
  const [savedVideos, setSavedVideos] = useState(() => (
    readJsonStorage(STORAGE_KEYS.savedVideos, []) || []
  ));
  const [scrapbookCloudReady, setScrapbookCloudReady] = useState(false);

  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.savedVideos, savedVideos);
  }, [savedVideos]);

  useEffect(() => {
    let isCancelled = false;

    const syncScrapbookFromCloud = async () => {
      const localSavedVideos = readJsonStorage(STORAGE_KEYS.savedVideos, []) || [];

      try {
        if (localSavedVideos.length > 0) {
          await saveScrapbookVideos(localSavedVideos);
        }

        const data = await fetchScrapbook();
        if (!data.success) throw new Error(data.error || '스크랩북을 불러오지 못했습니다.');
        if (isCancelled) return;

        setSavedVideos(data.videos || []);
        setScrapbookCloudReady(true);
      } catch {
        if (!isCancelled) setScrapbookCloudReady(false);
      }
    };

    syncScrapbookFromCloud();
    return () => { isCancelled = true; };
  }, []);

  const isVideoSaved = (videoId) => savedVideos.some(video => video.videoId === videoId);

  const toggleScrapVideo = async (video) => {
    const isSaved = isVideoSaved(video.videoId);

    setSavedVideos(prev => {
      if (isSaved) return prev.filter(savedVideo => savedVideo.videoId !== video.videoId);
      return [...prev, video];
    });

    if (!scrapbookCloudReady) return;

    try {
      if (isSaved) await deleteScrapbookVideo(video.videoId);
      else await saveScrapbookVideos([video]);
    } catch {
      setScrapbookCloudReady(false);
    }
  };

  return {
    savedVideos,
    isVideoSaved,
    toggleScrapVideo,
  };
}
