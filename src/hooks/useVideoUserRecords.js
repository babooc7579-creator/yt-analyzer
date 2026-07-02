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

const VIDEO_RECORDS_LOAD_WARNING = 'Cloud 연결 실패로 이 브라우저에 남아 있던 영상 판단 기록을 임시로 표시 중입니다. 이 기록은 Cloud 기준 데이터가 아닙니다.';
const VIDEO_RECORDS_SAVE_WARNING = '영상 판단 기록이 Cloud에 저장되지 않았습니다. 화면에는 임시로 반영됐지만 Cloud 동기화가 필요합니다.';
const VIDEO_RECORDS_CLEAR_WARNING = '판단 기록 초기화가 Cloud에 반영되지 않았습니다. 화면에는 임시로 초기화됐지만 새로고침 후 다시 나타날 수 있습니다.';

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
          setVideoRecordsSyncWarning(VIDEO_RECORDS_LOAD_WARNING);
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
      const cloudRecord = await saveRecordToCloud(record);
      setVideoUserRecords(prev => ({
        ...prev,
        [videoId]: cloudRecord,
      }));
      return true;
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
      const cloudRecord = await saveRecordToCloud(record);
      setVideoUserRecords(prev => ({
        ...prev,
        [videoId]: cloudRecord,
      }));
      return true;
    } catch {
      setVideoRecordsSyncWarning(VIDEO_RECORDS_SAVE_WARNING);
      return false;
    }
  };

  const clearRadarDecisions = async () => {
    const confirmed = window.confirm(
      'Cloud 영상 판단 기록을 전체 초기화할까요?\n\n봤음, 나중에 보기, 제외, 제작 후보 같은 판단 기록이 지워지고 숨겨졌던 후보가 다시 보일 수 있습니다.'
    );

    if (!confirmed) return false;

    setVideoUserRecords({});
    try {
      const data = await clearVideoUserRecords();
      if (!data.success) throw new Error(data.error || '영상 판단 기록을 초기화하지 못했습니다.');
      cacheCloudRecords({});
      setVideoRecordsSyncWarning('');
      return true;
    } catch {
      setVideoRecordsSyncWarning(VIDEO_RECORDS_CLEAR_WARNING);
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
