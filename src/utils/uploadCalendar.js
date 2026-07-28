import {
  PRODUCTION_STATUS,
  PRODUCTION_STATUSES,
  PRODUCTION_STATUS_LABELS,
  getProductionStatusFromRecord,
  hasAnyProductionStatus,
} from '../constants/status';

export const UPLOAD_CALENDAR_STATUS_OPTIONS = [
  { value: 'all', label: '전체 제작 상태' },
  { value: 'candidate', label: '제작 후보·검토' },
  { value: 'active', label: '제작 중' },
  { value: 'done', label: '업로드 완료' },
];

export const UPLOAD_CALENDAR_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const toArray = (items) => (Array.isArray(items) ? items : []);
const toRecordMap = (records) => records && typeof records === 'object' ? records : {};
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_PATTERN = /^\d{4}-\d{2}$/;

const pad = (value) => String(value).padStart(2, '0');

export const formatLocalDateKey = (date) => (
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
);

export const getCurrentMonthKey = (date = new Date()) => (
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
);

const parseMonthKey = (monthKey) => {
  const safeMonthKey = MONTH_PATTERN.test(String(monthKey || '')) ? monthKey : getCurrentMonthKey();
  const [year, month] = safeMonthKey.split('-').map(Number);
  return { month, year };
};

export const shiftCalendarMonth = (monthKey, amount) => {
  const { month, year } = parseMonthKey(monthKey);
  const shifted = new Date(year, month - 1 + Number(amount || 0), 1);
  return getCurrentMonthKey(shifted);
};

export const getCalendarMonthLabel = (monthKey) => {
  const { month, year } = parseMonthKey(monthKey);
  return `${year}년 ${month}월`;
};

const getVideoMap = (videos) => new Map(
  toArray(videos)
    .filter((video) => video?.videoId)
    .map((video) => [video.videoId, video]),
);

const getCalendarStatusGroup = (status) => {
  if (status === PRODUCTION_STATUS.ACTIVE) return 'active';
  if (status === PRODUCTION_STATUS.DONE) return 'done';
  return 'candidate';
};

const getProductionItems = ({ videoUserRecords, videos, scheduled } = {}) => {
  const videoMap = getVideoMap(videos);

  return Object.entries(toRecordMap(videoUserRecords))
    .filter(([, record]) => hasAnyProductionStatus(record, PRODUCTION_STATUSES))
    .filter(([, record]) => DATE_PATTERN.test(String(record?.targetPublishDate || '')) === scheduled)
    .map(([recordKey, record]) => {
      const videoId = record.videoId || recordKey;
      const video = videoMap.get(videoId) || null;
      const status = getProductionStatusFromRecord(record);
      return {
        date: scheduled ? record.targetPublishDate : '',
        draftTitle: record.draftTitle || '',
        record,
        sourceLoaded: Boolean(video),
        sourceTitle: video?.title || '',
        status,
        statusGroup: getCalendarStatusGroup(status),
        statusLabel: PRODUCTION_STATUS_LABELS[status] || '제작 후보',
        thumbnail: video?.thumbnail || '',
        title: record.draftTitle || video?.title || `영상 ${videoId}`,
        video,
        videoId,
      };
    })
    .sort((left, right) => (
      scheduled
        ? left.date.localeCompare(right.date) || left.title.localeCompare(right.title, 'ko-KR')
        : left.title.localeCompare(right.title, 'ko-KR')
    ));
};

export const getUploadCalendarItems = (options = {}) => getProductionItems({ ...options, scheduled: true });

export const getUnscheduledUploadCalendarItems = (options = {}) => getProductionItems({ ...options, scheduled: false });

export const filterUploadCalendarItems = (items, statusFilter = 'all') => (
  statusFilter === 'all'
    ? toArray(items)
    : toArray(items).filter((item) => item.statusGroup === statusFilter)
);

export const getUploadCalendarGridDays = ({ items, monthKey, todayKey } = {}) => {
  const { month, year } = parseMonthKey(monthKey);
  const firstDay = new Date(year, month - 1, 1);
  const gridStart = new Date(year, month - 1, 1 - firstDay.getDay());
  const itemsByDate = toArray(items).reduce((map, item) => {
    const current = map.get(item.date) || [];
    current.push(item);
    map.set(item.date, current);
    return map;
  }, new Map());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
    const dateKey = formatLocalDateKey(date);
    return {
      dateKey,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month - 1,
      isToday: dateKey === todayKey,
      items: itemsByDate.get(dateKey) || [],
    };
  });
};

export const countUnscheduledProductionRecords = (videoUserRecords) => (
  Object.values(toRecordMap(videoUserRecords)).filter((record) => (
    hasAnyProductionStatus(record, PRODUCTION_STATUSES)
    && !DATE_PATTERN.test(String(record?.targetPublishDate || ''))
  )).length
);

export const getUploadCalendarSummary = ({
  items,
  monthKey,
  todayKey,
  videoUserRecords,
} = {}) => {
  const scheduledItems = toArray(items);
  return {
    monthCount: scheduledItems.filter((item) => item.date.startsWith(`${monthKey}-`)).length,
    overdueCount: scheduledItems.filter((item) => item.date < todayKey && item.status !== PRODUCTION_STATUS.DONE).length,
    scheduledCount: scheduledItems.length,
    todayCount: scheduledItems.filter((item) => item.date === todayKey).length,
    unscheduledCount: countUnscheduledProductionRecords(videoUserRecords),
    upcomingCount: scheduledItems.filter((item) => item.date > todayKey && item.status !== PRODUCTION_STATUS.DONE).length,
  };
};

export const getUploadCalendarEmptyState = ({ productionRecordCount = 0, scheduledCount = 0 } = {}) => {
  if (productionRecordCount === 0) {
    return {
      description: '수집 영상이나 오늘 레이더에서 만들 소재를 제작 후보로 표시하면 일정 관리 흐름을 시작할 수 있습니다.',
      title: '아직 제작 후보가 없습니다',
    };
  }

  if (scheduledCount === 0) {
    return {
      description: '제작 후보함에서 목표 업로드 날짜를 입력하고 온라인 저장소(Azure DB)에 저장하면 이 달력에 자동으로 표시됩니다.',
      title: '날짜가 정해진 제작 후보가 없습니다',
    };
  }

  return null;
};

export const getUploadCalendarFilterEmptyState = ({
  statusFilter = 'all',
  visibleCount = 0,
} = {}) => {
  if (statusFilter === 'all' || visibleCount > 0) return null;

  const statusLabel = UPLOAD_CALENDAR_STATUS_OPTIONS.find((option) => option.value === statusFilter)?.label
    || '선택한 제작 상태';

  return {
    actionLabel: '전체 제작 상태 보기',
    description: `${statusLabel}에 해당하는 일정이 없습니다. 전체 상태로 돌아가면 저장된 다른 일정을 다시 볼 수 있습니다. 화면 필터만 초기화하며 온라인 저장소(Azure DB) 데이터는 바꾸지 않습니다.`,
    title: '선택한 상태의 일정이 없습니다',
  };
};
