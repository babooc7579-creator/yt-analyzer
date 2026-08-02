export const YOUTUBE_SEARCH_REGION_OPTIONS = [
  { value: '', label: '검색 지역 전체' },
  { value: 'KR', label: '대한민국' },
  { value: 'US', label: '미국' },
  { value: 'JP', label: '일본' },
  { value: 'GB', label: '영국' },
  { value: 'CA', label: '캐나다' },
  { value: 'AU', label: '호주' },
  { value: 'IN', label: '인도' },
  { value: 'DE', label: '독일' },
  { value: 'FR', label: '프랑스' },
  { value: 'TW', label: '대만' },
  { value: 'SG', label: '싱가포르' },
];

export const YOUTUBE_SEARCH_LANGUAGE_OPTIONS = [
  { value: '', label: '우선 언어 없음' },
  { value: 'ko', label: '한국어 우선' },
  { value: 'en', label: '영어 우선' },
  { value: 'ja', label: '일본어 우선' },
  { value: 'zh', label: '중국어 우선' },
  { value: 'es', label: '스페인어 우선' },
  { value: 'de', label: '독일어 우선' },
  { value: 'fr', label: '프랑스어 우선' },
  { value: 'hi', label: '힌디어 우선' },
  { value: 'pt', label: '포르투갈어 우선' },
  { value: 'th', label: '태국어 우선' },
];

export const YOUTUBE_SEARCH_DATE_OPTIONS = [
  { value: 'all', label: '업로드 시기 전체' },
  { value: '7', label: '최근 7일' },
  { value: '30', label: '최근 30일' },
  { value: '90', label: '최근 90일' },
];

export const YOUTUBE_SEARCH_DURATION_OPTIONS = [
  { value: '', label: '영상 길이 전체' },
  { value: 'short', label: '4분 미만' },
  { value: 'medium', label: '4~20분' },
  { value: 'long', label: '20분 초과' },
];

export const YOUTUBE_SEARCH_ORDER_OPTIONS = [
  { value: 'relevance', label: '관련도순' },
  { value: 'viewCount', label: '조회수순' },
  { value: 'date', label: '최신순' },
];

export const YOUTUBE_SEARCH_MINIMUM_VIEW_OPTIONS = [
  { value: 0, label: '조회수 전체' },
  { value: 10000, label: '1만 이상' },
  { value: 100000, label: '10만 이상' },
  { value: 1000000, label: '100만 이상' },
];

export function getPublishedAfter(days, now = new Date()) {
  const dayCount = Number(days || 0);
  if (!Number.isFinite(dayCount) || dayCount <= 0) return '';
  return new Date(now.getTime() - dayCount * 86400000).toISOString();
}

export function buildYoutubeSearchOptions(filters, pageToken = '') {
  return {
    q: String(filters.query || '').trim(),
    maxResults: 25,
    order: filters.order || 'relevance',
    videoDuration: filters.duration || '',
    regionCode: filters.regionCode || '',
    relevanceLanguage: filters.language || '',
    publishedAfter: getPublishedAfter(filters.dateRange),
    pageToken,
  };
}

const findOptionLabel = (options, value) => options.find((option) => option.value === value)?.label || value;

export function formatYoutubeSearchCriteria(filters = {}, { includeVideoFilters = true } = {}) {
  const regionLabel = findOptionLabel(YOUTUBE_SEARCH_REGION_OPTIONS, filters.regionCode || '');
  const languageLabel = findOptionLabel(YOUTUBE_SEARCH_LANGUAGE_OPTIONS, filters.language || '');
  const parts = [
    filters.regionCode ? `${regionLabel}에서 시청 가능` : regionLabel,
    languageLabel,
  ];

  if (includeVideoFilters) {
    parts.push(
      findOptionLabel(YOUTUBE_SEARCH_DATE_OPTIONS, filters.dateRange || 'all'),
      findOptionLabel(YOUTUBE_SEARCH_DURATION_OPTIONS, filters.duration || ''),
      findOptionLabel(YOUTUBE_SEARCH_ORDER_OPTIONS, filters.order || 'relevance'),
    );
  }

  return parts.join(' · ');
}

export function filterYoutubeSearchResults(items, minimumViews = 0) {
  const threshold = Number(minimumViews || 0);
  return (Array.isArray(items) ? items : []).filter((item) => Number(item?.viewCount || 0) >= threshold);
}

export function toDiscoveryLinkPayload(video, query) {
  return {
    url: video.url || `https://www.youtube.com/watch?v=${video.videoId}`,
    platform: 'youtube',
    title: video.title || '',
    linkedVideoId: video.videoId || '',
    status: 'inbox',
    memo: [`키워드 검색: ${String(query || '').trim()}`, video.channelTitle ? `채널: ${video.channelTitle}` : '']
      .filter(Boolean)
      .join(' · '),
  };
}
