import { PRODUCTION_STATUS } from '../constants/status';
import { getIsoTodayDate } from './dates';
import { getProductionSummary } from './productionKanbanData';

export const PRODUCTION_KANBAN_FILTER = {
  ALL: 'all',
  FOCUS: 'focus',
  CANDIDATE: PRODUCTION_STATUS.CANDIDATE,
  ACTIVE: PRODUCTION_STATUS.ACTIVE,
  DONE: PRODUCTION_STATUS.DONE,
  LINKS: 'links',
};

export const PRODUCTION_KANBAN_FILTER_OPTIONS = [
  { value: PRODUCTION_KANBAN_FILTER.ALL, label: '전체 작업' },
  { value: PRODUCTION_KANBAN_FILTER.FOCUS, label: '오늘 집중' },
  { value: PRODUCTION_KANBAN_FILTER.CANDIDATE, label: '제작 후보' },
  { value: PRODUCTION_KANBAN_FILTER.ACTIVE, label: '제작 중' },
  { value: PRODUCTION_KANBAN_FILTER.DONE, label: '업로드 완료' },
  { value: PRODUCTION_KANBAN_FILTER.LINKS, label: '발견 링크' },
];

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
  toArray(videos).filter((video) => matchesProductionVideoSearch({ ...options, video }))
);

const createEmptyGroups = () => ({
  [PRODUCTION_STATUS.CANDIDATE]: [],
  [PRODUCTION_STATUS.ACTIVE]: [],
  [PRODUCTION_STATUS.DONE]: [],
});

export const getFilteredProductionKanbanData = ({
  dataModel,
  draftRecords,
  filterMode = PRODUCTION_KANBAN_FILTER.ALL,
  searchQuery = '',
  today = getIsoTodayDate(),
  videoUserRecords,
} = {}) => {
  const source = dataModel && typeof dataModel === 'object' ? dataModel : {};
  const sourceGroups = toRecordMap(source.groupedVideos);
  const filterOptions = { draftRecords, searchQuery, videoUserRecords };
  const focusVideos = filterVideos(source.focusVideos, filterOptions);
  const groupedVideos = createEmptyGroups();

  Object.keys(groupedVideos).forEach((status) => {
    groupedVideos[status] = filterVideos(sourceGroups[status], filterOptions);
  });

  const discoveryLinkCandidates = toArray(source.discoveryLinkCandidates).filter((link) => (
    matchesProductionLinkSearch({ link, searchQuery })
  ));

  if (filterMode !== PRODUCTION_KANBAN_FILTER.ALL) {
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
} = {}) => {
  const sourceSummary = dataModel?.productionSummary || {};
  const filteredSummary = filteredDataModel?.productionSummary || {};
  const sourceLinkCount = toArray(dataModel?.discoveryLinkCandidates).length;
  const filteredLinkCount = toArray(filteredDataModel?.discoveryLinkCandidates).length;
  const totalCount = Number(sourceSummary.videoCount || 0) + sourceLinkCount;
  const visibleCount = Number(filteredSummary.videoCount || 0) + filteredLinkCount;
  const hasActiveFilters = filterMode !== PRODUCTION_KANBAN_FILTER.ALL || Boolean(normalizeSearchText(searchQuery));

  return {
    hasActiveFilters,
    metricText: hasActiveFilters
      ? `전체 ${totalCount}개 중 ${visibleCount}개 표시`
      : `작업 항목 ${totalCount}개`,
    totalCount,
    visibleCount,
  };
};
