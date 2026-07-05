import {
  RADAR_HIDDEN_VIDEO_STATUSES,
  VIDEO_STATUS,
  normalizeVideoUserRecord,
  normalizeVideoUserRecords,
  withRecordStatus,
} from '../constants/status';

export const getCloudVideoUserRecords = (records = {}) => normalizeVideoUserRecords(records || {});

export const getCloudVideoUserRecord = (record = {}) => normalizeVideoUserRecord(record);

export const upsertVideoUserRecord = (records, record) => ({
  ...records,
  [record.videoId]: record,
});

export const createVideoStatusRecord = (records, videoId, status, extraUpdates = {}, updatedAt) => (
  withRecordStatus({
    ...(records[videoId] || {}),
    videoId,
  }, status, {
    ...extraUpdates,
    updatedAt,
  })
);

export const createUpdatedVideoUserRecord = (records, videoId, updates, updatedAt) => (
  normalizeVideoUserRecord({
    ...(records[videoId] || {}),
    videoId,
    ...updates,
    updatedAt,
  })
);

export const createRadarRestoredRecord = (record = {}, videoId, updatedAt) => {
  const keptStatusIds = Array.isArray(record.statusIds)
    ? record.statusIds.filter(status => !RADAR_HIDDEN_VIDEO_STATUSES.includes(status))
    : [];

  return {
    ...record,
    videoId,
    status: VIDEO_STATUS.UNSEEN,
    statusIds: [...new Set([...keptStatusIds, VIDEO_STATUS.UNSEEN])],
    updatedAt,
  };
};
