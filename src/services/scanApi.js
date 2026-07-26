import { getJson, postJson } from './functionApiClient';

export const buildScanLogsPath = ({
  channelId = '',
  continuationToken = '',
  pageSize = 100,
  status = '',
} = {}) => {
  const params = new URLSearchParams({ pageSize: String(pageSize) });
  if (channelId) params.set('channelId', channelId);
  if (status) params.set('status', status);
  if (continuationToken) params.set('continuationToken', continuationToken);
  return `/scan-logs?${params.toString()}`;
};

export const fetchScanLogs = (options) => getJson(buildScanLogsPath(options));

export const scanSelectedChannels = (channelIds) => (
  postJson('/scan/selected', { channelIds, reason: 'manual' })
);

export const scanChannels = ({ tag } = {}) => (
  getJson(tag ? `/scan?tag=${encodeURIComponent(tag)}` : '/scan')
);
