import { useEffect, useRef, useState } from 'react';
import { clearVideoUserRecords, fetchVideoUserRecords, saveVideoUserRecord } from '../services/videoRecordsApi';
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from '../services/storage';
import {
  VIDEO_RECORDS_CLEAR_CONFIRM_MESSAGE,
  VIDEO_RECORDS_SYNC_WARNINGS,
} from '../constants/syncWarnings';
import {
  VIDEO_USER_RECORD_SAVE_FAILED_MESSAGE,
  VIDEO_USER_RECORDS_CLEAR_FAILED_MESSAGE,
  VIDEO_USER_RECORDS_LOAD_FAILED_MESSAGE,
  createRadarRestoredRecord,
  createUpdatedVideoUserRecord,
  createVideoUserRecordPatch,
  createVideoStatusRecord,
  getCloudVideoUserRecord,
  getCloudVideoUserRecords,
  restoreVideoUserRecord,
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
    setVideoUserRecords(prev => restoreVideoUserRecord(prev, videoId, previousRecord));
  };

  const syncVideoUserRecordsFromCloud = async ({ isCancelled = () => false } = {}) => {
    try {
      const data = await fetchVideoUserRecords();
      if (!data.success) throw new Error(data.error || VIDEO_USER_RECORDS_LOAD_FAILED_MESSAGE);
      if (isCancelled()) return false;
      const cloudRecords = getCloudVideoUserRecords(data.records);
      setVideoUserRecords(cloudRecords);
      cacheCloudRecords(cloudRecords);
      setVideoRecordsSyncWarning('');
      return true;
    } catch {
      if (!isCancelled()) {
        const fallbackRecords = getCloudVideoUserRecords(readJsonStorage(STORAGE_KEYS.videoUserRecords, {}));
        setVideoUserRecords(fallbackRecords);
        setVideoRecordsSyncWarning(VIDEO_RECORDS_SYNC_WARNINGS.loadFallback);
      }
      return false;
    }
  };

  useEffect(() => {
    let isCancelled = false;
    syncVideoUserRecordsFromCloud({ isCancelled: () => isCancelled });
    return () => { isCancelled = true; };
  }, []);

  const saveRecordToCloud = async (record) => {
    const data = await saveVideoUserRecord(record);
    if (!data.success) throw new Error(data.error || VIDEO_USER_RECORD_SAVE_FAILED_MESSAGE);
    const cloudRecord = getCloudVideoUserRecord(data.record || record);
    cacheCloudRecord(cloudRecord);
    setVideoRecordsSyncWarning('');
    return cloudRecord;
  };

  const saveOptimisticVideoRecord = async (videoId, record, previousRecord, cloudPatch = record) => {
    setVideoUserRecords(prev => ({
      ...prev,
      [videoId]: record,
    }));

    try {
      const cloudRecord = await saveRecordToCloud(cloudPatch);
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
    const updatedAt = new Date().toISOString();
    const record = createVideoStatusRecord(videoUserRecords, videoId, status, extraUpdates, updatedAt);
    const cloudPatch = createVideoUserRecordPatch(videoId, {
      ...extraUpdates,
      status: record.status,
      statusIds: record.statusIds,
    }, updatedAt);

    return saveOptimisticVideoRecord(videoId, record, previousRecord, cloudPatch);
  };

  const updateVideoUserRecord = async (videoId, updates) => {
    const previousRecord = videoUserRecords[videoId];
    const updatedAt = new Date().toISOString();
    const record = createUpdatedVideoUserRecord(videoUserRecords, videoId, updates, updatedAt);
    const cloudPatch = createVideoUserRecordPatch(videoId, updates, updatedAt);

    return saveOptimisticVideoRecord(videoId, record, previousRecord, cloudPatch);
  };

  const restoreVideoToRadar = async (videoId) => {
    const previousRecord = videoUserRecords[videoId];
    const updatedAt = new Date().toISOString();
    const record = createRadarRestoredRecord(videoUserRecords[videoId], videoId, updatedAt);
    const cloudPatch = createVideoUserRecordPatch(videoId, {
      status: record.status,
      statusIds: record.statusIds,
    }, updatedAt);

    return saveOptimisticVideoRecord(videoId, record, previousRecord, cloudPatch);
  };

  const clearRadarDecisions = async () => {
    const confirmed = window.confirm(VIDEO_RECORDS_CLEAR_CONFIRM_MESSAGE);

    if (!confirmed) return false;

    const previousRecords = videoUserRecords;
    setVideoUserRecords({});
    try {
      const data = await clearVideoUserRecords();
      if (!data.success) throw new Error(data.error || VIDEO_USER_RECORDS_CLEAR_FAILED_MESSAGE);
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
    retryVideoUserRecordsSync: syncVideoUserRecordsFromCloud,
  };
}
