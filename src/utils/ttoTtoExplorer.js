import {
  getRadarDecisionBuckets,
  getRadarDecisionGroups,
  getRadarDecisionSummary,
  getRadarLoadedDecisionCount,
  getRadarScore,
} from './radarCandidates';
import { isRadarHiddenRecord } from '../constants/status';
import { isTtoTtoCandidate } from './video';

export const TTOTTO_SORT_OPTIONS = [
  { value: 'priority', label: '추천순' },
  { value: 'multiplier', label: '대박 지수순' },
  { value: 'views', label: '조회수순' },
  { value: 'oldest', label: '오래된 영상순' },
  { value: 'newest', label: '최근 영상순' },
];

export const TTOTTO_LENGTH_OPTIONS = [
  { value: 'all', label: '전체 길이' },
  { value: 'shorts', label: '쇼츠' },
  { value: 'long', label: '롱폼' },
];

export const TTOTTO_VIEW_OPTIONS = [
  { value: 0, label: '조회수 전체' },
  { value: 10000, label: '1만 이상' },
  { value: 100000, label: '10만 이상' },
  { value: 1000000, label: '100만 이상' },
];

const toArray = (items) => (Array.isArray(items) ? items : []);

const toObject = (item) => (item && typeof item === 'object' ? item : {});

const toNumber = (value) => {
  const numericValue = Number(value || 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const toSearchText = (value) => String(value || '').trim().toLowerCase();

export const getAllTtoTtoCandidates = (videos = []) => (
  toArray(videos)
    .filter((video) => video && typeof video === 'object')
    .filter(isTtoTtoCandidate)
);

export const getOpenTtoTtoCandidates = ({
  videoUserRecords,
  videos,
} = {}) => {
  const recordMap = toObject(videoUserRecords);

  return getAllTtoTtoCandidates(videos).filter((video) => (
    !isRadarHiddenRecord(recordMap[video.videoId])
  ));
};

const sortTtoTtoCandidates = (videos, sortType) => {
  const result = [...videos];

  if (sortType === 'multiplier') {
    return result.sort((a, b) => toNumber(b.multiplier) - toNumber(a.multiplier));
  }
  if (sortType === 'views') {
    return result.sort((a, b) => toNumber(b.view_count) - toNumber(a.view_count));
  }
  if (sortType === 'oldest') {
    return result.sort((a, b) => toNumber(b.daysOld) - toNumber(a.daysOld));
  }
  if (sortType === 'newest') {
    return result.sort((a, b) => toNumber(a.daysOld) - toNumber(b.daysOld));
  }

  return result.sort((a, b) => getRadarScore(b) - getRadarScore(a));
};

export const filterAndSortTtoTtoCandidates = ({
  lengthFilter = 'all',
  minimumViews = 0,
  searchQuery = '',
  sortType = 'priority',
  videoUserRecords,
  videos,
} = {}) => {
  const normalizedQuery = toSearchText(searchQuery);
  const minimumViewCount = toNumber(minimumViews);
  let result = getOpenTtoTtoCandidates({ videoUserRecords, videos });

  if (normalizedQuery) {
    result = result.filter((video) => (
      toSearchText(video.title).includes(normalizedQuery)
      || toSearchText(video.channel_title).includes(normalizedQuery)
    ));
  }

  if (minimumViewCount > 0) {
    result = result.filter((video) => toNumber(video.view_count) >= minimumViewCount);
  }

  if (lengthFilter === 'shorts') {
    result = result.filter((video) => Boolean(video.isShorts));
  } else if (lengthFilter === 'long') {
    result = result.filter((video) => !video.isShorts);
  }

  return sortTtoTtoCandidates(result, sortType);
};

export const getTtoTtoExplorerDataModel = ({
  filteredCandidates,
  videoUserRecords,
  videos,
} = {}) => {
  const videoList = toArray(videos);
  const allCandidates = getAllTtoTtoCandidates(videoList);
  const openCandidates = getOpenTtoTtoCandidates({
    videoUserRecords,
    videos: videoList,
  });
  const decisionBuckets = getRadarDecisionBuckets({
    userRecordMap: videoUserRecords,
    videoList: allCandidates,
  });
  const decisionSummary = getRadarDecisionSummary(decisionBuckets);

  return {
    decisionGroups: getRadarDecisionGroups(decisionBuckets),
    decisionSummary,
    loadedDecisionCount: getRadarLoadedDecisionCount(decisionSummary),
    summary: {
      filteredCandidateCount: toArray(filteredCandidates).length,
      handledCandidateCount: Math.max(0, allCandidates.length - openCandidates.length),
      loadedVideoCount: videoList.length,
      openCandidateCount: openCandidates.length,
      totalCandidateCount: allCandidates.length,
    },
  };
};

export const getTtoTtoExplorerEmptyState = ({
  hasActiveFilters,
  loadedVideoCount = 0,
  openCandidateCount = 0,
  selectedChannelCount = 0,
} = {}) => {
  if (loadedVideoCount === 0) {
    return {
      actionAriaLabel: selectedChannelCount > 0
        ? `선택 채널 ${selectedChannelCount}개 수집 영상 목록 불러오기, 온라인 저장소(Azure DB) 조회이며 YouTube API 호출 없음`
        : '수집 영상 목록 화면으로 이동, 온라인 저장소(Azure DB) 조회 및 YouTube API 호출 없음',
      actionLabel: selectedChannelCount > 0 ? '수집 영상 목록 불러오기' : '수집 영상 목록 화면 열기',
      actionTitle: selectedChannelCount > 0
        ? `온라인 저장소(Azure DB)에서 선택 채널 ${selectedChannelCount}개의 수집 영상을 조회합니다. 새 YouTube API 호출은 없습니다.`
        : '수집 영상 목록 화면으로 이동합니다. 이동만으로 온라인 저장소(Azure DB) 조회나 YouTube API 호출은 실행되지 않습니다.',
      description: selectedChannelCount > 0
        ? `온라인 저장소(Azure DB)에서 선택한 채널 ${selectedChannelCount}개의 수집 영상 정보를 불러오면 후보를 계산합니다. YouTube API를 자동 호출하지 않습니다.`
        : '채널을 선택한 뒤 수집 영상을 불러오세요. 이 화면은 YouTube API를 자동 호출하지 않습니다.',
      kind: 'not-loaded',
      title: '아직 불러온 수집 영상 정보가 없습니다',
    };
  }

  if (openCandidateCount === 0) {
    return {
      actionAriaLabel: '수집 영상 목록 화면으로 이동, 온라인 저장소(Azure DB) 데이터 변경 및 YouTube API 호출 없음',
      actionLabel: '수집 영상 목록 화면 열기',
      actionTitle: '수집 영상 목록 화면으로 이동합니다. 처리 기록이나 온라인 저장소(Azure DB) 데이터를 바꾸지 않으며 YouTube API를 호출하지 않습니다.',
      description: '현재 불러온 영상에서는 미처리 또터또 후보가 없습니다. 처리 기록은 아래에서 되돌릴 수 있습니다.',
      kind: 'completed',
      title: '확인할 후보를 모두 처리했습니다',
    };
  }

  if (hasActiveFilters) {
    return {
      actionAriaLabel: '또터또 탐색 필터 초기화, 온라인 저장소(Azure DB) 데이터 변경 및 YouTube API 호출 없음',
      actionLabel: '필터 초기화',
      actionTitle: '현재 검색어와 화면 필터를 초기화합니다. 온라인 저장소(Azure DB) 데이터나 처리 기록은 바꾸지 않으며 YouTube API를 호출하지 않습니다.',
      description: '후보는 있지만 현재 검색어나 필터 조건과 일치하지 않습니다.',
      kind: 'filtered',
      title: '조건에 맞는 후보가 없습니다',
    };
  }

  return null;
};
