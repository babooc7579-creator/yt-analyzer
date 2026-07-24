import { PRODUCTION_STATUS } from '../constants/status';
import { getIsoTodayDate } from './dates';
import { hasProductionDraftChanges } from './productionKanbanActions';
import { getProductionSummary } from './productionKanbanData';

export const PRODUCTION_KANBAN_FILTER = {
  ALL: 'all',
  FOCUS: 'focus',
  CANDIDATE: PRODUCTION_STATUS.CANDIDATE,
  ACTIVE: PRODUCTION_STATUS.ACTIVE,
  DONE: PRODUCTION_STATUS.DONE,
  LINKS: 'links',
  UNSAVED: 'unsaved',
};

export const PRODUCTION_KANBAN_FILTER_OPTIONS = [
  { value: PRODUCTION_KANBAN_FILTER.ALL, label: '전체 작업' },
  { value: PRODUCTION_KANBAN_FILTER.FOCUS, label: '오늘 집중' },
  { value: PRODUCTION_KANBAN_FILTER.CANDIDATE, label: '제작 후보' },
  { value: PRODUCTION_KANBAN_FILTER.ACTIVE, label: '제작 중' },
  { value: PRODUCTION_KANBAN_FILTER.DONE, label: '업로드 완료' },
  { value: PRODUCTION_KANBAN_FILTER.LINKS, label: '발견 링크' },
  { value: PRODUCTION_KANBAN_FILTER.UNSAVED, label: 'Cloud 저장 전' },
];

export const getProductionKanbanSearchContext = ({
  searchQuery = '',
  source = '',
  targetDiscoveryLinkId = '',
  targetVideoId = '',
} = {}) => {
  const normalizedQuery = String(searchQuery || '').trim();
  const videoLabel = normalizedQuery || '선택한 영상';
  const linkLabel = normalizedQuery || '선택한 발견 링크';

  if (source === 'today-radar') {
    if (!normalizedQuery && !targetVideoId) return null;

    return {
      description: `오늘의 레이더에서 제작 후보로 표시한 "${videoLabel}" ${targetVideoId ? '영상 한 건을' : '항목을'} 바로 보여주고 있습니다. 검색을 해제하면 전체 제작 작업을 다시 볼 수 있습니다.`,
      label: '오늘의 레이더에서 이어온 후보',
      resetLabel: '전체 작업 보기',
      resetTitle: '오늘의 레이더에서 이어온 후보 검색만 해제합니다. Cloud 데이터는 변경하지 않습니다.',
      returnLabel: '오늘의 레이더로 돌아가기',
      returnTarget: 'home',
      returnTitle: '오늘의 레이더로 돌아갑니다. 화면 이동만 하며 Cloud 데이터는 변경하지 않습니다.',
    };
  }

  if (source === 'scrapbook') {
    if (!normalizedQuery && !targetVideoId) return null;

    return {
      description: `스크랩북에서 제작 후보로 표시한 "${videoLabel}" ${targetVideoId ? '영상 한 건을' : '항목을'} 바로 보여주고 있습니다. 검색을 해제하면 전체 제작 작업을 다시 볼 수 있습니다.`,
      label: '스크랩북에서 이어온 후보',
      resetLabel: '전체 작업 보기',
      resetTitle: '스크랩북에서 이어온 후보 검색만 해제합니다. Cloud 데이터는 변경하지 않습니다.',
      returnLabel: '스크랩북으로 돌아가기',
      returnTarget: 'reference-vault',
      returnTitle: '스크랩북으로 돌아갑니다. 화면 이동만 하며 Cloud 데이터는 변경하지 않습니다.',
    };
  }

  if (source === 'discovery-links') {
    if (!normalizedQuery && !targetDiscoveryLinkId) return null;

    return {
      description: `발견 링크 저장에서 제작 후보로 표시한 "${linkLabel}" ${targetDiscoveryLinkId ? '링크 한 건을' : '항목을'} 바로 보여주고 있습니다. 검색을 해제하면 전체 제작 작업을 다시 볼 수 있습니다.`,
      label: '발견 링크에서 이어온 후보',
      resetLabel: '전체 작업 보기',
      resetTitle: '발견 링크에서 이어온 후보 검색만 해제합니다. Cloud 데이터는 변경하지 않습니다.',
      returnLabel: '발견 링크 저장으로 돌아가기',
      returnTarget: 'discovery-links',
      returnTitle: '발견 링크 저장 화면으로 돌아갑니다. 화면 이동만 하며 Cloud 데이터는 변경하지 않습니다.',
    };
  }

  if (source !== 'upload-calendar') return null;
  if (!normalizedQuery && !targetVideoId) return null;

  return {
    description: `업로드 캘린더에서 선택한 "${videoLabel}" ${targetVideoId ? '영상 한 건을' : '항목을'} 찾고 있습니다. 검색을 해제하면 전체 제작 작업을 다시 볼 수 있습니다.`,
    label: '캘린더에서 가져온 검색',
    resetLabel: '전체 작업 보기',
    resetTitle: '캘린더에서 가져온 화면 검색만 해제합니다. Cloud 데이터는 변경하지 않습니다.',
    returnLabel: '캘린더로 돌아가기',
    returnTarget: 'upload-calendar',
    returnTitle: '업로드 캘린더로 돌아갑니다. 화면 이동만 하며 Cloud 데이터는 변경하지 않습니다.',
  };
};

const toArray = (items) => (Array.isArray(items) ? items : []);
const toRecordMap = (items) => (items && typeof items === 'object' ? items : {});

const normalizeSearchText = (value) => String(value || '').trim().toLocaleLowerCase('ko-KR');

const includesSearchText = (values, searchText) => (
  !searchText || values.some((value) => normalizeSearchText(value).includes(searchText))
);

const getVideoRecord = (video, draftRecords, videoUserRecords) => {
  const videoId = video?.videoId;
  if (!videoId) return {};

  return toRecordMap(draftRecords)[videoId] || toRecordMap(videoUserRecords)[videoId] || {};
};

export const matchesProductionVideoSearch = ({
  draftRecords,
  searchQuery,
  video,
  videoUserRecords,
} = {}) => {
  const record = getVideoRecord(video, draftRecords, videoUserRecords);
  const searchText = normalizeSearchText(searchQuery);

  return includesSearchText([
    video?.title,
    video?.channel_title,
    video?.channelTitle,
    record.draftTitle,
    record.note,
    record.targetPublishDate,
  ], searchText);
};

export const matchesProductionLinkSearch = ({ link, searchQuery } = {}) => {
  const searchText = normalizeSearchText(searchQuery);

  return includesSearchText([
    link?.title,
    link?.memo,
    link?.note,
    link?.platform,
    link?.sourceUrl,
    link?.url,
  ], searchText);
};

const filterVideos = (videos, options) => (
  toArray(videos).filter((video) => (
    options.targetVideoId
      ? video?.videoId === options.targetVideoId
      : matchesProductionVideoSearch({ ...options, video })
  ))
);

const createEmptyGroups = () => ({
  [PRODUCTION_STATUS.CANDIDATE]: [],
  [PRODUCTION_STATUS.ACTIVE]: [],
  [PRODUCTION_STATUS.DONE]: [],
});

export const hasUnsavedProductionVideoDraft = ({
  draftRecords,
  video,
  videoUserRecords,
} = {}) => {
  const videoId = video?.videoId;
  const drafts = toRecordMap(draftRecords);
  if (!videoId || !Object.prototype.hasOwnProperty.call(drafts, videoId)) return false;

  return hasProductionDraftChanges(
    toRecordMap(videoUserRecords)[videoId],
    drafts[videoId],
  );
};

const filterUnsavedVideos = (videos, options) => (
  toArray(videos).filter((video) => hasUnsavedProductionVideoDraft({ ...options, video }))
);

export const getFilteredProductionKanbanData = ({
  dataModel,
  draftRecords,
  filterMode = PRODUCTION_KANBAN_FILTER.ALL,
  searchQuery = '',
  targetDiscoveryLinkId = '',
  targetVideoId = '',
  today = getIsoTodayDate(),
  videoUserRecords,
} = {}) => {
  const source = dataModel && typeof dataModel === 'object' ? dataModel : {};
  const sourceGroups = toRecordMap(source.groupedVideos);
  const filterOptions = { draftRecords, searchQuery, targetVideoId, videoUserRecords };
  let focusVideos = targetDiscoveryLinkId ? [] : filterVideos(source.focusVideos, filterOptions);
  const groupedVideos = createEmptyGroups();

  Object.keys(groupedVideos).forEach((status) => {
    groupedVideos[status] = targetDiscoveryLinkId ? [] : filterVideos(sourceGroups[status], filterOptions);
  });

  const discoveryLinkCandidates = targetVideoId
    ? []
    : toArray(source.discoveryLinkCandidates).filter((link) => (
      targetDiscoveryLinkId
        ? link?.id === targetDiscoveryLinkId
        : matchesProductionLinkSearch({ link, searchQuery })
    ));

  if (filterMode !== PRODUCTION_KANBAN_FILTER.ALL) {
    if (filterMode === PRODUCTION_KANBAN_FILTER.UNSAVED) {
      focusVideos = filterUnsavedVideos(focusVideos, filterOptions);
      Object.keys(groupedVideos).forEach((status) => {
        groupedVideos[status] = filterUnsavedVideos(groupedVideos[status], filterOptions);
      });
      discoveryLinkCandidates.length = 0;
    } else {
      if (filterMode !== PRODUCTION_KANBAN_FILTER.FOCUS) {
        focusVideos.length = 0;
      }

      Object.keys(groupedVideos).forEach((status) => {
        if (filterMode !== status) groupedVideos[status] = [];
      });

      if (filterMode !== PRODUCTION_KANBAN_FILTER.LINKS) {
        discoveryLinkCandidates.length = 0;
      }
    }
  }

  const productionSummary = getProductionSummary({
    discoveryLinkCandidates,
    draftRecords,
    focusVideos,
    groupedVideos,
    today,
    videoUserRecords,
  });

  return {
    discoveryLinkCandidates,
    focusVideos,
    groupedVideos,
    productionSummary,
  };
};

export const getProductionKanbanFilterSummary = ({
  dataModel,
  filteredDataModel,
  filterMode = PRODUCTION_KANBAN_FILTER.ALL,
  searchQuery = '',
  targetDiscoveryLinkId = '',
  targetVideoId = '',
} = {}) => {
  const sourceSummary = dataModel?.productionSummary || {};
  const filteredSummary = filteredDataModel?.productionSummary || {};
  const sourceLinkCount = toArray(dataModel?.discoveryLinkCandidates).length;
  const filteredLinkCount = toArray(filteredDataModel?.discoveryLinkCandidates).length;
  const totalCount = Number(sourceSummary.videoCount || 0) + sourceLinkCount;
  const visibleCount = Number(filteredSummary.videoCount || 0) + filteredLinkCount;
  const hasActiveFilters = (
    filterMode !== PRODUCTION_KANBAN_FILTER.ALL
    || Boolean(normalizeSearchText(searchQuery))
    || Boolean(String(targetDiscoveryLinkId || '').trim())
    || Boolean(String(targetVideoId || '').trim())
  );

  return {
    hasActiveFilters,
    metricText: hasActiveFilters
      ? `전체 ${totalCount}개 중 ${visibleCount}개 표시`
      : `작업 항목 ${totalCount}개`,
    totalCount,
    visibleCount,
  };
};
