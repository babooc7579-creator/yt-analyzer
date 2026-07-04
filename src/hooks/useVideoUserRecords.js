import { useEffect, useRef, useState } from 'react';
import { clearVideoUserRecords, fetchVideoUserRecords, saveVideoUserRecord } from '../services/functionApi';
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from '../services/storage';
import {
  RADAR_HIDDEN_VIDEO_STATUSES,
  VIDEO_STATUS,
  normalizeVideoUserRecord,
  normalizeVideoUserRecords,
  withRecordStatus,
} from '../constants/status';
import {
  VIDEO_RECORDS_CLEAR_CONFIRM_MESSAGE,
  VIDEO_RECORDS_SYNC_WARNINGS,
} from '../constants/syncWarnings';

export function useVideoUserRecords() {
  const cloudRecordsCacheRef = useRef({});
  const [videoUserRecords, setVideoUserRecords] = useState({});
  const [videoRecordsSyncWarning, setVideoRecordsSyncWarning] = useState('');

  const cacheCloudRecords = (records) => {
    cloudRecordsCacheRef.current = records;
    writeJsonStorage(STORAGE_KEYS.videoUserRecords, records);
  };

  const cacheCloudRecord = (record) => {
    const nextRecords = {
      ...cloudRecordsCacheRef.current,
      [record.videoId]: record,
    };
    cacheCloudRecords(nextRecords);
  };

  useEffect(() => {
    let isCancelled = false;

    const syncVideoUserRecordsFromCloud = async () => {
      try {
        const data = await fetchVideoUserRecords();
        if (!data.success) throw new Error(data.error || '영상 판단 기록을 불러오지 못했습니다.');
        if (isCancelled) return;
        const cloudRecords = normalizeVideoUserRecords(data.records || {});
        setVideoUserRecords(cloudRecords);
        cacheCloudRecords(cloudRecords);
        setVideoRecordsSyncWarning('');
      } catch {
        if (!isCancelled) {
          const fallbackRecords = normalizeVideoUserRecords(readJsonStorage(STORAGE_KEYS.videoUserRecords, {}) || {});
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
    const cloudRecord = normalizeVideoUserRecord(data.record || record);
    cacheCloudRecord(cloudRecord);
    setVideoRecordsSyncWarning('');
    return cloudRecord;
  };

  const markVideoStatus = async (videoId, status, extraUpdates = {}) => {
    const record = withRecordStatus({
      ...(videoUserRecords[videoId] || {}),
      videoId,
    }, status, {
      ...extraUpdates,
      updatedAt: new Date().toISOString(),
    });

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
      setVideoRecordsSyncWarning(VIDEO_RECORDS_SYNC_WARNINGS.saveFailed);
      return false;
    }
  };

  const updateVideoUserRecord = async (videoId, updates) => {
    const record = normalizeVideoUserRecord({
      ...(videoUserRecords[videoId] || {}),
      videoId,
      ...updates,
      updatedAt: new Date().toISOString(),
    });

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
      setVideoRecordsSyncWarning(VIDEO_RECORDS_SYNC_WARNINGS.saveFailed);
      return false;
    }
  };

  const restoreVideoToRadar = async (videoId) => {
    const existingRecord = videoUserRecords[videoId] || {};
    const keptStatusIds = Array.isArray(existingRecord.statusIds)
      ? existingRecord.statusIds.filter(status => !RADAR_HIDDEN_VIDEO_STATUSES.includes(status))
      : [];

    const record = {
      ...existingRecord,
      videoId,
      status: VIDEO_STATUS.UNSEEN,
      statusIds: [...new Set([...keptStatusIds, VIDEO_STATUS.UNSEEN])],
      updatedAt: new Date().toISOString(),
    };

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
      setVideoRecordsSyncWarning(VIDEO_RECORDS_SYNC_WARNINGS.saveFailed);
      return false;
    }
  };

  const clearRadarDecisions = async () => {
    const confirmed = window.confirm(VIDEO_RECORDS_CLEAR_CONFIRM_MESSAGE);

    if (!confirmed) return false;

    setVideoUserRecords({});
    try {
      const data = await clearVideoUserRecords();
      if (!data.success) throw new Error(data.error || '영상 판단 기록을 초기화하지 못했습니다.');
      cacheCloudRecords({});
      setVideoRecordsSyncWarning('');
      return true;
    } catch {
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
