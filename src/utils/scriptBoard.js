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
const hasText = (value) => normalizeSearchText(value).length > 0;

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
      record.scriptAnalysis,
      record.scriptBody,
      record.scriptOutline,
      record.targetPublishDate,
    ].some((value) => normalizeSearchText(value).includes(query));
  });
};

export const getScriptWorkspaceChecklist = ({ record, video } = {}) => {
  const safeRecord = record && typeof record === 'object' ? record : {};
  const safeVideo = video && typeof video === 'object' ? video : {};
  const items = [
    {
      key: 'source',
      isReady: Boolean(safeVideo.sourceUrl || safeVideo.videoId),
      label: '원본',
      missingText: '원본 없음',
      title: safeVideo.sourceType === 'discovery_link'
        ? '발견함에 저장된 외부 원본 링크입니다. 링크 확인만으로 외부 수집이나 저장을 실행하지 않습니다.'
        : 'YouTube 원본 확인용입니다. 화면 표시만 하며 YouTube API를 호출하지 않습니다.',
    },
    {
      key: 'title',
      isReady: hasText(safeRecord.draftTitle),
      label: '제목',
      missingText: '제목 필요',
      title: '내 채널에 맞게 바꿀 제목입니다. 변경사항 저장 버튼을 눌러야 온라인 저장소(Azure DB)에 반영됩니다.',
    },
    {
      key: 'analysis',
      isReady: hasText(safeRecord.scriptAnalysis),
      label: '분석',
      missingText: '분석 필요',
      title: '원본의 핵심 소재, 훅과 차별화 방향을 정리합니다.',
    },
    {
      key: 'outline',
      isReady: hasText(safeRecord.scriptOutline),
      label: '구성안',
      missingText: '구성 필요',
      title: '도입, 전개와 마무리 순서를 정리합니다.',
    },
    {
      key: 'body',
      isReady: hasText(safeRecord.scriptBody),
      label: '대본 본문',
      missingText: '본문 필요',
      title: '실제 촬영·편집에 사용할 대본 본문입니다.',
    },
    {
      key: 'publish-date',
      isReady: hasText(safeRecord.targetPublishDate),
      label: '업로드 일정',
      missingText: '일정 미정',
      title: '업로드 예정일입니다. 변경사항 저장 버튼을 눌러야 온라인 저장소(Azure DB)에 반영됩니다.',
    },
  ];
  const remainingItems = items.filter((item) => !item.isReady);
  const readyCount = items.length - remainingItems.length;
  const isReady = remainingItems.length === 0;

  return {
    description: isReady
      ? '원본, 제목, 분석, 구성안, 대본 본문과 일정이 모두 준비됐습니다.'
      : '남은 항목을 채워 대본 작업을 이어가세요. 상태 확인만으로 저장이나 API 호출은 실행되지 않습니다.',
    items,
    readyCount,
    remainingItems,
    summaryText: isReady ? `${readyCount}/${items.length} 준비` : `${remainingItems.length}개 남음`,
    title: isReady ? '대본 작업 준비 완료' : '대본 작업 체크',
    tone: isReady ? 'ready' : 'working',
    totalCount: items.length,
  };
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
      description: '오늘의 레이더나 수집 영상에서 제작 후보로 표시한 영상이 이곳에 나타납니다.',
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
