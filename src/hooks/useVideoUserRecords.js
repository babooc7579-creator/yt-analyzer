import { useEffect, useState } from 'react';
import { clearVideoUserRecords, fetchVideoUserRecords, saveVideoUserRecord } from '../services/functionApi';
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from '../services/storage';
import {
  RADAR_HIDDEN_VIDEO_STATUSES,
  VIDEO_STATUS,
  normalizeVideoUserRecord,
  normalizeVideoUserRecords,
  withRecordStatus,
} from '../constants/status';

const VIDEO_RECORDS_LOAD_WARNING = 'Cloud의 영상 판단 기록을 불러오지 못해 이 브라우저에 남아 있던 기록을 임시로 사용합니다.';
const VIDEO_RECORDS_SAVE_WARNING = '영상 판단 기록이 Cloud에 저장되지 않았을 수 있습니다. 화면에는 임시로 남아 있지만 새로고침 후 달라질 수 있습니다.';
const VIDEO_RECORDS_CLEAR_WARNING = '판단 기록 초기화가 Cloud에 반영되지 않았을 수 있습니다. 나중에 다시 나타나면 한 번 더 초기화해 주세요.';

export function useVideoUserRecords() {
  const [videoUserRecords, setVideoUserRecords] = useState(() => (
    normalizeVideoUserRecords(readJsonStorage(STORAGE_KEYS.videoUserRecords, {}) || {})
  ));
  const [videoRecordsSyncWarning, setVideoRecordsSyncWarning] = useState('');

  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.videoUserRecords, videoUserRecords);
  }, [videoUserRecords]);

  useEffect(() => {
    let isCancelled = false;

    const syncVideoUserRecordsFromCloud = async () => {
      try {
        const data = await fetchVideoUserRecords();
        if (!data.success) throw new Error(data.error || '영상 판단 기록을 불러오지 못했습니다.');
        if (isCancelled) return;
        setVideoUserRecords(normalizeVideoUserRecords(data.records || {}));
        setVideoRecordsSyncWarning('');
      } catch {
        if (!isCancelled) setVideoRecordsSyncWarning(VIDEO_RECORDS_LOAD_WARNING);
      }
    };

    syncVideoUserRecordsFromCloud();
    return () => { isCancelled = true; };
  }, []);

  const saveRecordToCloud = async (record) => {
    const data = await saveVideoUserRecord(record);
    if (!data.success) throw new Error(data.error || '영상 판단 기록을 저장하지 못했습니다.');
    setVideoRecordsSyncWarning('');
    return true;
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
      return await saveRecordToCloud(record);
    } catch {
      setVideoRecordsSyncWarning(VIDEO_RECORDS_SAVE_WARNING);
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
      return await saveRecordToCloud(record);
    } catch {
      setVideoRecordsSyncWarning(VIDEO_RECORDS_SAVE_WARNING);
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
      return await saveRecordToCloud(record);
    } catch {
      setVideoRecordsSyncWarning(VIDEO_RECORDS_SAVE_WARNING);
      return false;
    }
  };

  const clearRadarDecisions = async () => {
    setVideoUserRecords({});
    try {
      const data = await clearVideoUserRecords();
      if (!data.success) throw new Error(data.error || '영상 판단 기록을 초기화하지 못했습니다.');
      setVideoRecordsSyncWarning('');
    } catch {
      setVideoRecordsSyncWarning(VIDEO_RECORDS_CLEAR_WARNING);
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
