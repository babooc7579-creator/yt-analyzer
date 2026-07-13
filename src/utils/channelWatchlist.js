import {
  CHANNEL_GRADE,
  CHANNEL_GRADE_LABELS,
  CHANNEL_STATUS,
  getChannelGrade,
  getChannelStatus,
} from '../constants/status';
import { formatRelativeTime } from './channelScanDisplay';
import { getYouTubeChannelUrl } from './urls';

export const CHANNEL_WATCH_GRADE_OPTIONS = [
  { value: 'all', label: '등급 전체' },
  { value: 'high', label: 'S/A 우선' },
  { value: CHANNEL_GRADE.S, label: 'S 등급' },
  { value: CHANNEL_GRADE.A, label: 'A 등급' },
  { value: CHANNEL_GRADE.B, label: 'B 등급' },
  { value: CHANNEL_GRADE.C, label: 'C 등급' },
  { value: CHANNEL_GRADE.UNCLASSIFIED, label: '미분류' },
];

export const CHANNEL_WATCH_SCAN_OPTIONS = [
  { value: 'all', label: '수집일 전체' },
  { value: 'never', label: '미수집' },
  { value: 'overdue7', label: '7일 이상' },
  { value: 'overdue30', label: '30일 이상' },
];

const GRADE_PRIORITY = {
  [CHANNEL_GRADE.S]: 4,
  [CHANNEL_GRADE.A]: 3,
  [CHANNEL_GRADE.B]: 2,
  [CHANNEL_GRADE.C]: 1,
  [CHANNEL_GRADE.UNCLASSIFIED]: 0,
};

const DAY_MS = 24 * 60 * 60 * 1000;

const toArray = (items) => (Array.isArray(items) ? items : []);

const toText = (value) => String(value || '').trim().toLowerCase();

export const getChannelLastScanDate = (channel = {}) => {
  const value = channel.lastScanSummary?.scannedAt || channel.lastScannedAt;
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getChannelDaysSinceScan = (channel, now = Date.now()) => {
  const scanDate = getChannelLastScanDate(channel);
  if (!scanDate) return null;
  return Math.max(0, Math.floor((Number(now) - scanDate.getTime()) / DAY_MS));
};

export const getChannelWatchPriority = (channel, now = Date.now()) => {
  const grade = getChannelGrade(channel);
  const daysSinceScan = getChannelDaysSinceScan(channel, now);
  const neverScannedBonus = daysSinceScan === null ? 1000 : 0;
  const overdueScore = daysSinceScan === null ? 0 : Math.min(daysSinceScan, 365);

  return neverScannedBonus + (GRADE_PRIORITY[grade] || 0) * 100 + overdueScore;
};

export const getChannelWatchReasons = (channel, now = Date.now()) => {
  const reasons = [];
  const grade = getChannelGrade(channel);
  const daysSinceScan = getChannelDaysSinceScan(channel, now);

  if (grade === CHANNEL_GRADE.S || grade === CHANNEL_GRADE.A) {
    reasons.push(`${CHANNEL_GRADE_LABELS[grade]} 등급 핵심 채널`);
  }
  if (daysSinceScan === null) reasons.push('아직 새 영상 수집 기록 없음');
  else if (daysSinceScan >= 30) reasons.push(`${daysSinceScan}일 동안 미확인`);
  else if (daysSinceScan >= 7) reasons.push(`${daysSinceScan}일 전에 마지막 확인`);

  return reasons.length > 0 ? reasons : ['운영중 채널'];
};

const matchesGradeFilter = (channel, gradeFilter) => {
  const grade = getChannelGrade(channel);
  if (gradeFilter === 'all') return true;
  if (gradeFilter === 'high') return [CHANNEL_GRADE.S, CHANNEL_GRADE.A].includes(grade);
  return grade === gradeFilter;
};

const matchesScanFilter = (channel, scanFilter, now) => {
  const daysSinceScan = getChannelDaysSinceScan(channel, now);
  if (scanFilter === 'never') return daysSinceScan === null;
  if (scanFilter === 'overdue7') return daysSinceScan === null || daysSinceScan >= 7;
  if (scanFilter === 'overdue30') return daysSinceScan === null || daysSinceScan >= 30;
  return true;
};

export const filterAndSortChannelWatchlist = ({
  channels,
  gradeFilter = 'all',
  now = Date.now(),
  scanFilter = 'all',
  searchQuery = '',
} = {}) => {
  const query = toText(searchQuery);

  return toArray(channels)
    .filter((channel) => channel && typeof channel === 'object')
    .filter((channel) => getChannelStatus(channel) === CHANNEL_STATUS.ACTIVE)
    .filter((channel) => !query || [
      channel.title,
      channel.category,
      ...(Array.isArray(channel.tags) ? channel.tags : []),
    ].some((value) => toText(value).includes(query)))
    .filter((channel) => matchesGradeFilter(channel, gradeFilter))
    .filter((channel) => matchesScanFilter(channel, scanFilter, now))
    .sort((a, b) => getChannelWatchPriority(b, now) - getChannelWatchPriority(a, now));
};

export const getChannelWatchlistSummary = ({
  channels,
  filteredChannels,
  now = Date.now(),
  selectedChannelIds,
} = {}) => {
  const channelList = toArray(channels);
  const activeChannels = channelList.filter((channel) => (
    getChannelStatus(channel) === CHANNEL_STATUS.ACTIVE
  ));

  return {
    activeChannelCount: activeChannels.length,
    filteredChannelCount: toArray(filteredChannels).length,
    highGradeChannelCount: activeChannels.filter((channel) => (
      [CHANNEL_GRADE.S, CHANNEL_GRADE.A].includes(getChannelGrade(channel))
    )).length,
    neverScannedChannelCount: activeChannels.filter((channel) => (
      getChannelDaysSinceScan(channel, now) === null
    )).length,
    savedChannelCount: channelList.length,
    selectedChannelCount: toArray(selectedChannelIds).length,
  };
};

export const getChannelWatchlistCardViewProps = ({
  channel,
  isSelected = false,
  now = Date.now(),
} = {}) => {
  const safeChannel = channel && typeof channel === 'object' ? channel : {};
  const grade = getChannelGrade(safeChannel);
  const scanDate = getChannelLastScanDate(safeChannel);
  const channelTitle = safeChannel.title || '제목 없는 채널';

  return {
    channelTitle,
    channelUrl: getYouTubeChannelUrl(safeChannel),
    gradeLabel: `등급 ${CHANNEL_GRADE_LABELS[grade]}`,
    isSelected,
    reasons: getChannelWatchReasons(safeChannel, now),
    scanText: scanDate ? `마지막 확인 ${formatRelativeTime(scanDate)}` : '아직 수집 기록 없음',
    selectionLabel: isSelected ? '선택 해제' : '오늘 볼 채널로 선택',
    thumbnail: safeChannel.thumbnail,
  };
};
