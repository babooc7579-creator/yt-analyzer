import { formatRelativeTime } from './channelScanDisplay';
import { formatKoreanDateTime } from './dates';

export const RECENT_SCAN_STATUS_FILTERS = [
  { id: 'all', label: '전체' },
  { id: 'failed', label: '실패' },
  { id: 'partial', label: '부분 성공' },
  { id: 'never', label: '미수집' },
  { id: 'success', label: '성공' },
];

const STATUS_PRIORITY = {
  failed: 0,
  partial: 1,
  never: 2,
  success: 3,
};

const STATUS_LABELS = {
  failed: '실패',
  partial: '부분 성공',
  never: '미수집',
  success: '성공',
};

const toArray = (value) => (Array.isArray(value) ? value : []);

const getScanStatus = (channel = {}) => {
  const summary = channel.lastScanSummary || {};
  const scannedAt = summary.scannedAt || channel.lastScannedAt || '';
  const rawStatus = String(summary.status || '').toLowerCase();

  if (rawStatus === 'failed' || summary.error) return 'failed';
  if (rawStatus === 'partial') return 'partial';
  return scannedAt ? 'success' : 'never';
};

export const getRecentScanStatusRows = (channels = []) => (
  toArray(channels)
    .map((channel) => {
      const summary = channel.lastScanSummary || {};
      const scannedAt = summary.scannedAt || channel.lastScannedAt || '';
      const status = getScanStatus(channel);
      const timestamp = scannedAt ? new Date(scannedAt).getTime() : 0;

      return {
        channelId: channel.id || channel.channelId || '',
        channelTitle: channel.title || channel.channelTitle || '이름 없는 채널',
        error: summary.error || '',
        exactScannedAt: formatKoreanDateTime(scannedAt, '기록 없음'),
        grade: channel.grade || '미분류',
        newVideosFound: Number(summary.newVideosFound) || 0,
        scannedAt,
        scannedText: scannedAt ? formatRelativeTime(scannedAt) : '아직 수집하지 않음',
        statsRefreshed: Number(summary.statsRefreshed) || 0,
        status,
        statusLabel: STATUS_LABELS[status],
        tags: toArray(channel.tags).filter(Boolean),
        timestamp: Number.isFinite(timestamp) ? timestamp : 0,
      };
    })
    .sort((left, right) => (
      STATUS_PRIORITY[left.status] - STATUS_PRIORITY[right.status]
      || right.timestamp - left.timestamp
      || left.channelTitle.localeCompare(right.channelTitle, 'ko')
    ))
);

export const getRecentScanStatusSummary = (rows = []) => {
  const safeRows = toArray(rows);

  return {
    total: safeRows.length,
    success: safeRows.filter((row) => row.status === 'success').length,
    partial: safeRows.filter((row) => row.status === 'partial').length,
    failed: safeRows.filter((row) => row.status === 'failed').length,
    never: safeRows.filter((row) => row.status === 'never').length,
  };
};

export const filterRecentScanStatusRows = ({
  filter = 'all',
  query = '',
  rows = [],
} = {}) => {
  const normalizedQuery = String(query).trim().toLocaleLowerCase('ko');

  return toArray(rows).filter((row) => {
    if (filter !== 'all' && row.status !== filter) return false;
    if (!normalizedQuery) return true;

    return [
      row.channelTitle,
      row.grade,
      ...toArray(row.tags),
      row.error,
    ].some((value) => String(value).toLocaleLowerCase('ko').includes(normalizedQuery));
  });
};
