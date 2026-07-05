import { useEffect, useRef, useState } from 'react';
import { clearVideoUserRecords, fetchVideoUserRecords, saveVideoUserRecord } from '../services/functionApi';
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from '../services/storage';
import {
  VIDEO_RECORDS_CLEAR_CONFIRM_MESSAGE,
  VIDEO_RECORDS_SYNC_WARNINGS,
} from '../constants/syncWarnings';
import {
  createRadarRestoredRecord,
  createUpdatedVideoUserRecord,
  createVideoStatusRecord,
  getCloudVideoUserRecord,
  getCloudVideoUserRecords,
  upsertVideoUserRecord,
} from '../utils/videoUserRecords';

export function useVideoUserRecords() {
  const cloudRecordsCacheRef = useRef({});
  const [videoUserRecords, setVideoUserRecords] = useState({});
  const [videoRecordsSyncWarning, setVideoRecordsSyncWarning] = useState('');

  const cacheCloudRecords = (records) => {
    cloudRecordsCacheRef.current = records;
    writeJsonStorage(STORAGE_KEYS.videoUserRecords, records);
  };

  const cacheCloudRecord = (record) => {
    cacheCloudRecords(upsertVideoUserRecord(cloudRecordsCacheRef.current, record));
  };

  const restorePreviousRecord = (videoId, previousRecord) => {
    setVideoUserRecords(prev => {
      if (previousRecord) {
        return {
          ...prev,
          [videoId]: previousRecord,
        };
      }

      const next = { ...prev };
      delete next[videoId];
      return next;
    });
  };

  useEffect(() => {
    let isCancelled = false;

    const syncVideoUserRecordsFromCloud = async () => {
      try {
        const data = await fetchVideoUserRecords();
        if (!data.success) throw new Error(data.error || '영상 판단 기록을 불러오지 못했습니다.');
        if (isCancelled) return;
        const cloudRecords = getCloudVideoUserRecords(data.records);
        setVideoUserRecords(cloudRecords);
        cacheCloudRecords(cloudRecords);
        setVideoRecordsSyncWarning('');
      } catch {
        if (!isCancelled) {
          const fallbackRecords = getCloudVideoUserRecords(readJsonStorage(STORAGE_KEYS.videoUserRecords, {}));
          setVideoUserRecords(fallbackRecords);
          setVideoRecordsSyncWarning(VIDEO_RECORDS_SYNC_WARNINGS.loadFallback);
        }
      }
    };

    syncVideoUserRecordsFromCloud();
    return () => { isCancelled = true; };
  }, []);

  const saveRecordToCloud = async (record) => {
    const data = await saveVideoUserRecord(record);
    if (!data.success) throw new Error(data.error || '영상 판단 기록을 저장하지 못했습니다.');
    const cloudRecord = getCloudVideoUserRecord(data.record || record);
    cacheCloudRecord(cloudRecord);
    setVideoRecordsSyncWarning('');
    return cloudRecord;
  };

  const saveOptimisticVideoRecord = async (videoId, record, previousRecord) => {
    setVideoUserRecords(prev => ({
      ...prev,
      [videoId]: record,
    }));

    try {
      const cloudRecord = await saveRecordToCloud(record);
      setVideoUserRecords(prev => ({
        ...prev,
        [videoId]: cloudRecord,
      }));
      return true;
    } catch {
      restorePreviousRecord(videoId, previousRecord);
      setVideoRecordsSyncWarning(VIDEO_RECORDS_SYNC_WARNINGS.saveFailed);
      return false;
    }
  };

  const markVideoStatus = async (videoId, status, extraUpdates = {}) => {
    const previousRecord = videoUserRecords[videoId];
    const record = createVideoStatusRecord(videoUserRecords, videoId, status, extraUpdates, new Date().toISOString());

    return saveOptimisticVideoRecord(videoId, record, previousRecord);
  };

  const updateVideoUserRecord = async (videoId, updates) => {
    const previousRecord = videoUserRecords[videoId];
    const record = createUpdatedVideoUserRecord(videoUserRecords, videoId, updates, new Date().toISOString());

    return saveOptimisticVideoRecord(videoId, record, previousRecord);
  };

  const restoreVideoToRadar = async (videoId) => {
    const previousRecord = videoUserRecords[videoId];
    const record = createRadarRestoredRecord(videoUserRecords[videoId], videoId, new Date().toISOString());

    return saveOptimisticVideoRecord(videoId, record, previousRecord);
  };

  const clearRadarDecisions = async () => {
    const confirmed = window.confirm(VIDEO_RECORDS_CLEAR_CONFIRM_MESSAGE);

    if (!confirmed) return false;

    const previousRecords = videoUserRecords;
    setVideoUserRecords({});
    try {
      const data = await clearVideoUserRecords();
      if (!data.success) throw new Error(data.error || '영상 판단 기록을 초기화하지 못했습니다.');
      cacheCloudRecords({});
      setVideoRecordsSyncWarning('');
      return true;
    } catch {
      setVideoUserRecords(previousRecords);
      setVideoRecordsSyncWarning(VIDEO_RECORDS_SYNC_WARNINGS.clearFailed);
      return false;
    }
  };

  return {
    videoUserRecords,
    videoRecordsSyncWarning,
    markVideoStatus,
    updateVideoUserRecord,
    restoreVideoToRadar,
    clearRadarDecisions,
  };
}
