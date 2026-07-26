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

export const formatChannelGrade = (value) => {
  const grade = String(value || '').trim();
  const normalizedGrade = grade.toLowerCase();

  if (!grade || normalizedGrade === 'unclassified') return '미분류';
  if (['s', 'a', 'b', 'c'].includes(normalizedGrade)) return normalizedGrade.toUpperCase();
  return grade;
};

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
        grade: formatChannelGrade(channel.grade),
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

export const getScanHistoryRuns = (scanLogs = []) => {
  const runMap = new Map();

  toArray(scanLogs).filter(Boolean).forEach((log, index) => {
    const fallbackKey = log?.id || `${log?.channelId || 'channel'}-${log?.scannedAt || 'time'}-${index}`;
    const runId = log?.scanRunId || fallbackKey;
    const timestamp = log?.scannedAt ? new Date(log.scannedAt).getTime() : 0;
    const safeTimestamp = Number.isFinite(timestamp) ? timestamp : 0;
    const existingRun = runMap.get(runId) || {
      id: runId,
      trigger: log?.trigger || 'unknown',
      scannedAt: log?.scannedAt || '',
      timestamp: safeTimestamp,
      logs: [],
    };

    existingRun.logs.push(log);
    if (safeTimestamp > existingRun.timestamp) {
      existingRun.scannedAt = log?.scannedAt || existingRun.scannedAt;
      existingRun.timestamp = safeTimestamp;
    }
    if (existingRun.trigger === 'unknown' && log?.trigger) existingRun.trigger = log.trigger;
    runMap.set(runId, existingRun);
  });

  return [...runMap.values()]
    .map((run) => {
      const logs = run.logs
        .slice()
        .sort((left, right) => String(left?.channelTitle || '').localeCompare(String(right?.channelTitle || ''), 'ko'));
      const failed = logs.filter((log) => log?.status === 'failed').length;
      const partial = logs.filter((log) => log?.status === 'partial').length;
      const success = Math.max(0, logs.length - failed - partial);
      const status = failed === logs.length
        ? 'failed'
        : failed > 0 || partial > 0
          ? 'partial'
          : 'success';

      return {
        ...run,
        channelCount: logs.length,
        failed,
        logs,
        newVideosFound: logs.reduce((total, log) => total + (Number(log?.newVideosFound) || 0), 0),
        partial,
        statsRefreshed: logs.reduce((total, log) => total + (Number(log?.statsRefreshed) || 0), 0),
        status,
        success,
      };
    })
    .sort((left, right) => right.timestamp - left.timestamp);
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
