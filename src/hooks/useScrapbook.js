import { useEffect, useRef, useState } from 'react';
import { deleteScrapbookVideo, fetchScrapbook, saveScrapbookVideos } from '../services/functionApi';
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from '../services/storage';

const SCRAPBOOK_LOAD_WARNING = 'Cloud 연결 실패로 이 브라우저에 남아 있던 스크랩북을 임시로 표시 중입니다. 이 목록은 Cloud 기준 데이터가 아닙니다.';
const SCRAPBOOK_SAVE_WARNING = '스크랩북 변경이 Cloud에 저장되지 않았습니다. 브라우저 임시 기록으로 저장 완료 처리하지 않습니다.';
const SCRAPBOOK_CLOUD_REQUIRED_WARNING = 'Cloud 스크랩북을 확인하지 못해 지금은 보관 상태를 바꿀 수 없습니다. 잠시 뒤 새로고침 후 다시 시도해 주세요.';

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

        const cloudVideos = data.videos || [];
        setSavedVideos(cloudVideos);
        cacheCloudScrapbook(cloudVideos);
        setScrapbookCloudReady(true);
        setScrapbookSyncWarning('');
      } catch {
        if (!isCancelled) {
          const fallbackVideos = readJsonStorage(STORAGE_KEYS.savedVideos, []) || [];
          setSavedVideos(fallbackVideos);
          setScrapbookCloudReady(false);
          setScrapbookSyncWarning(SCRAPBOOK_LOAD_WARNING);
        }
      }
    };

    syncScrapbookFromCloud();
    return () => { isCancelled = true; };
  }, []);

  const isVideoSaved = (videoId) => savedVideos.some(video => video.videoId === videoId);

  const toggleScrapVideo = async (video) => {
    const isSaved = isVideoSaved(video.videoId);

    if (!scrapbookCloudReady) {
      setScrapbookSyncWarning(SCRAPBOOK_CLOUD_REQUIRED_WARNING);
      return false;
    }

    try {
      if (isSaved) {
        const data = await deleteScrapbookVideo(video.videoId);
        if (!data.success) throw new Error(data.error || '스크랩북에서 삭제하지 못했습니다.');
        const nextVideos = cloudScrapbookCacheRef.current.filter(savedVideo => savedVideo.videoId !== video.videoId);
        setSavedVideos(nextVideos);
        cacheCloudScrapbook(nextVideos);
      } else {
        const data = await saveScrapbookVideos([video]);
        if (!data.success) throw new Error(data.error || '스크랩북에 저장하지 못했습니다.');
        const nextVideos = [
          ...cloudScrapbookCacheRef.current.filter(savedVideo => savedVideo.videoId !== video.videoId),
          video,
        ];
        setSavedVideos(nextVideos);
        cacheCloudScrapbook(nextVideos);
      }
      setScrapbookSyncWarning('');
      return true;
    } catch {
      setScrapbookCloudReady(false);
      setScrapbookSyncWarning(SCRAPBOOK_SAVE_WARNING);
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
