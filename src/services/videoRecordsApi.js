import { deleteJson, getJson, postJson } from './functionApiClient';

export const fetchStoredVideosByChannelIds = (channelIds) => (
  getJson(`/videos?channelIds=${channelIds.join(',')}`)
);

export const fetchVideoUserRecords = () => getJson('/video-records');

export const saveVideoUserRecord = (record) => (
  postJson('/video-records', record)
);

export const clearVideoUserRecords = () => (
  deleteJson('/video-records')
);
