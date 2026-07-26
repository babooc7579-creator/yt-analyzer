import {
  PRODUCTION_STATUS,
  PRODUCTION_STATUS_LABELS,
  PRODUCTION_STATUSES,
  getProductionStatusFromRecord,
  hasAnyProductionStatus,
} from '../constants/status';
import {
  getProductionKanbanGroupStatus,
  isProductionFocusRecord,
} from './productionKanbanData';

export const SCRIPT_BOARD_FILTERS = [
  { id: 'all', label: '전체 작업' },
  { id: 'focus', label: '오늘 집중' },
  { id: PRODUCTION_STATUS.CANDIDATE, label: '제작 후보' },
  { id: PRODUCTION_STATUS.ACTIVE, label: '제작 중' },
  { id: PRODUCTION_STATUS.DONE, label: '업로드 완료' },
];

const toArray = (items) => (Array.isArray(items) ? items : []);
const toRecordMap = (records) => (
  records && typeof records === 'object' ? records : {}
);
const normalizeSearchText = (value) => String(value || '').trim().toLocaleLowerCase('ko-KR');

const getScriptBoardSortRank = (item) => {
  if (item.isFocus) return 0;
  if (item.groupStatus === PRODUCTION_STATUS.ACTIVE) return 1;
  if (item.groupStatus === PRODUCTION_STATUS.CANDIDATE) return 2;
  return 3;
};

export const getScriptBoardItems = ({ videoUserRecords, videos } = {}) => {
  const records = toRecordMap(videoUserRecords);

  return toArray(videos)
    .map((video) => {
      const videoId = String(video?.videoId || '').trim();
      const record = records[videoId] || {};
      if (!videoId || !hasAnyProductionStatus(record, PRODUCTION_STATUSES)) return null;

      const productionStatus = getProductionStatusFromRecord(record);
      const groupStatus = getProductionKanbanGroupStatus(productionStatus);
      return {
        groupStatus,
        id: videoId,
        isFocus: isProductionFocusRecord(record),
        productionStatus,
        record,
        statusLabel: PRODUCTION_STATUS_LABELS[productionStatus] || '제작 후보',
        video,
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const rankOrder = getScriptBoardSortRank(left) - getScriptBoardSortRank(right);
      if (rankOrder) return rankOrder;

      const dateOrder = String(left.record.targetPublishDate || '9999-12-31')
        .localeCompare(String(right.record.targetPublishDate || '9999-12-31'));
      if (dateOrder) return dateOrder;

      return Number(right.video.multiplier || 0) - Number(left.video.multiplier || 0);
    });
};

export const getScriptBoardVisibleItems = ({
  filterMode = 'all',
  items,
  searchQuery = '',
} = {}) => {
  const query = normalizeSearchText(searchQuery);

  return toArray(items).filter((item) => {
    const matchesFilter = filterMode === 'all'
      || (filterMode === 'focus' ? item.isFocus : item.groupStatus === filterMode);
    if (!matchesFilter) return false;
    if (!query) return true;

    const video = item.video || {};
    const record = item.record || {};
    return [
      video.title,
      video.channel_title,
      video.channelTitle,
      record.draftTitle,
      record.note,
      record.targetPublishDate,
    ].some((value) => normalizeSearchText(value).includes(query));
  });
};

export const getScriptBoardSummary = (items) => toArray(items).reduce((summary, item) => {
  summary.totalCount += 1;
  if (item.isFocus) summary.focusCount += 1;
  if (item.groupStatus === PRODUCTION_STATUS.CANDIDATE) summary.candidateCount += 1;
  if (item.groupStatus === PRODUCTION_STATUS.ACTIVE) summary.activeCount += 1;
  if (item.groupStatus === PRODUCTION_STATUS.DONE) summary.doneCount += 1;
  return summary;
}, {
  activeCount: 0,
  candidateCount: 0,
  doneCount: 0,
  focusCount: 0,
  totalCount: 0,
});

export const getScriptBoardEmptyState = ({ totalCount = 0, visibleCount = 0 } = {}) => {
  if (totalCount === 0) {
    return {
      actionLabel: '제작 후보 고르기',
      description: '오늘의 레이더나 저장 영상에서 제작 후보로 표시한 영상이 이곳에 나타납니다.',
      title: '아직 작성할 제작 후보가 없습니다',
      type: 'source',
    };
  }
  if (visibleCount === 0) {
    return {
      actionLabel: '전체 작업 보기',
      description: '현재 검색어나 진행 단계에 맞는 제작 작업이 없습니다. 필터를 초기화하면 전체 작업을 다시 볼 수 있습니다.',
      title: '조건에 맞는 작업이 없습니다',
      type: 'filter',
    };
  }
  return null;
};
