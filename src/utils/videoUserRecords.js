import {
  RADAR_HIDDEN_VIDEO_STATUSES,
  VIDEO_STATUS,
  normalizeVideoUserRecord,
  normalizeVideoUserRecords,
  withRecordStatus,
} from '../constants/status';

const toRecordMap = (records) => (
  records && typeof records === 'object' ? records : {}
);

const toRecordObject = (record) => (
  record && typeof record === 'object' ? record : {}
);

export const getCloudVideoUserRecords = (records = {}) => normalizeVideoUserRecords(records || {});

export const getCloudVideoUserRecord = (record = {}) => normalizeVideoUserRecord(record);

export const upsertVideoUserRecord = (records, record) => {
  const recordMap = toRecordMap(records);
  const nextRecord = toRecordObject(record);

  if (!nextRecord.videoId) return recordMap;

  return {
    ...recordMap,
    [nextRecord.videoId]: nextRecord,
  };
};

export const restoreVideoUserRecord = (records, videoId, previousRecord) => {
  const recordMap = toRecordMap(records);

  if (previousRecord) {
    return {
      ...recordMap,
      [videoId]: previousRecord,
    };
  }

  const nextRecords = { ...recordMap };
  delete nextRecords[videoId];
  return nextRecords;
};

export const createVideoStatusRecord = (records, videoId, status, extraUpdates = {}, updatedAt) => (
  withRecordStatus({
    ...(toRecordMap(records)[videoId] || {}),
    videoId,
  }, status, {
    ...toRecordObject(extraUpdates),
    updatedAt,
  })
);

export const createUpdatedVideoUserRecord = (records, videoId, updates, updatedAt) => (
  normalizeVideoUserRecord({
    ...(toRecordMap(records)[videoId] || {}),
    videoId,
    ...toRecordObject(updates),
    updatedAt,
  })
);

export const createRadarRestoredRecord = (record = {}, videoId, updatedAt) => {
  const sourceRecord = toRecordObject(record);
  const keptStatusIds = Array.isArray(sourceRecord.statusIds)
    ? sourceRecord.statusIds.filter(status => !RADAR_HIDDEN_VIDEO_STATUSES.includes(status))
    : [];

  return {
    ...sourceRecord,
    videoId,
    status: VIDEO_STATUS.UNSEEN,
    statusIds: [...new Set([...keptStatusIds, VIDEO_STATUS.UNSEEN])],
    updatedAt,
  };
};
