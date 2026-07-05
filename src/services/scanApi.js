import { getJson, postJson } from './functionApiClient';

export const scanSelectedChannels = (channelIds) => (
  postJson('/scan/selected', { channelIds, reason: 'manual' })
);

export const scanChannels = ({ tag } = {}) => (
  getJson(tag ? `/scan?tag=${encodeURIComponent(tag)}` : '/scan')
);
