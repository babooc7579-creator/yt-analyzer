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
  { value: '60', label: '최근 60일' },
  { value: 'year', label: '올해' },
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

export const YOUTUBE_CHANNEL_RESULT_SORT_OPTIONS = [
  { value: 'relevance', label: 'YouTube 관련도순' },
  { value: 'subscriberCount', label: '구독자 많은순' },
  { value: 'avgViewCount', label: '영상당 평균 높은순' },
  { value: 'totalVideoCount', label: '영상 수 많은순' },
];

export const YOUTUBE_CHANNEL_REGISTRATION_FILTER_OPTIONS = [
  { value: 'all', label: '등록 상태 전체' },
  { value: 'unregistered', label: '미등록 채널만' },
  { value: 'registered', label: '등록된 채널만' },
];

export const YOUTUBE_CHANNEL_COUNTRY_FILTER_OPTIONS = [
  { value: 'all', label: '채널 국가 전체' },
  { value: 'declared', label: '국가 등록 채널만' },
  { value: 'undeclared', label: '국가 미등록 채널만' },
];

export const YOUTUBE_CHANNEL_SELECTION_FILTER_OPTIONS = [
  { value: 'all', label: '비교 선택 전체' },
  { value: 'selected', label: '비교 선택만 보기' },
];

export const MAX_YOUTUBE_CHANNEL_REGISTRATION_SELECTION = 50;

export function toggleYoutubeChannelRegistrationSelection(selectedIds = [], channelId) {
  const normalizedId = String(channelId || '');
  const current = [...new Set((Array.isArray(selectedIds) ? selectedIds : []).map(String).filter(Boolean))];
  if (!normalizedId) return { ids: current, limitReached: false };
  if (current.includes(normalizedId)) {
    return { ids: current.filter((id) => id !== normalizedId), limitReached: false };
  }
  if (current.length >= MAX_YOUTUBE_CHANNEL_REGISTRATION_SELECTION) {
    return { ids: current, limitReached: true };
  }
  return { ids: [...current, normalizedId], limitReached: false };
}

export function addYoutubeChannelRegistrationSelections(selectedIds = [], channelIds = []) {
  const merged = [...new Set([
    ...(Array.isArray(selectedIds) ? selectedIds : []),
    ...(Array.isArray(channelIds) ? channelIds : []),
  ].map(String).filter(Boolean))];
  return {
    ids: merged.slice(0, MAX_YOUTUBE_CHANNEL_REGISTRATION_SELECTION),
    limitReached: merged.length > MAX_YOUTUBE_CHANNEL_REGISTRATION_SELECTION,
  };
}

export function getPublishedAfter(days, now = new Date()) {
  if (days === 'year') {
    return new Date(Date.UTC(now.getUTCFullYear(), 0, 1)).toISOString();
  }
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
    publishedAfter: filters.publishedAfter || getPublishedAfter(filters.dateRange),
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

export function hasYoutubeSearchCriteriaChanges(filters = {}, appliedFilters, { includeVideoFilters = true } = {}) {
  if (!appliedFilters) return false;
  const keys = includeVideoFilters
    ? ['query', 'regionCode', 'language', 'dateRange', 'duration', 'order']
    : ['query', 'regionCode', 'language'];
  return keys.some((key) => {
    const currentValue = key === 'query' ? String(filters[key] || '').trim() : String(filters[key] || '');
    const appliedValue = key === 'query' ? String(appliedFilters[key] || '').trim() : String(appliedFilters[key] || '');
    return currentValue !== appliedValue;
  });
}

export function prepareYoutubeSearchTargetSession({ sourceSession, targetSession, targetLabel }) {
  const targetHasOwnContext = Boolean(
    String(targetSession?.filters?.query || '').trim()
    || targetSession?.appliedFilters
    || targetSession?.items?.length,
  );
  if (targetHasOwnContext) return targetSession;

  const commonFilters = {
    query: String(sourceSession?.filters?.query || ''),
    regionCode: String(sourceSession?.filters?.regionCode || ''),
    language: String(sourceSession?.filters?.language || ''),
  };
  if (!commonFilters.query.trim() && !commonFilters.regionCode && !commonFilters.language) {
    return targetSession;
  }

  return {
    ...(targetSession || {}),
    filters: {
      ...(targetSession?.filters || {}),
      ...commonFilters,
    },
    notice: `${targetLabel}에 검색어·지역·언어 조건을 가져왔습니다. 검색 버튼을 누르기 전에는 YouTube API를 호출하지 않습니다.`,
  };
}

export function sortYoutubeChannelResults(items, sortBy = 'relevance') {
  const source = Array.isArray(items) ? items : [];
  if (sortBy === 'relevance') return [...source];
  return [...source].sort((left, right) => {
    const difference = Number(right?.[sortBy] || 0) - Number(left?.[sortBy] || 0);
    if (difference !== 0) return difference;
    return String(left?.title || '').localeCompare(String(right?.title || ''), 'ko');
  });
}

export function formatYoutubeChannelCountry(country) {
  if (!country) return '미등록';
  return findOptionLabel(YOUTUBE_SEARCH_REGION_OPTIONS, String(country).toUpperCase());
}

export function filterYoutubeChannelResults(items, filters = {}, { registeredIds = [], selectedIds = [] } = {}) {
  const registeredSet = registeredIds instanceof Set ? registeredIds : new Set(registeredIds.map(String));
  const selectedSet = selectedIds instanceof Set ? selectedIds : new Set(selectedIds.map(String));
  return (Array.isArray(items) ? items : []).filter((item) => {
    const channelId = String(item?.channelId || '');
    const registered = registeredSet.has(channelId);
    const selected = selectedSet.has(channelId);
    const hasCountry = Boolean(String(item?.country || '').trim());
    if (filters.registration === 'registered' && !registered) return false;
    if (filters.registration === 'unregistered' && registered) return false;
    if (filters.country === 'declared' && !hasCountry) return false;
    if (filters.country === 'undeclared' && hasCountry) return false;
    if (filters.selection === 'selected' && !selected) return false;
    return true;
  });
}

export function filterYoutubeVideoResultsByChannelRegistration(items, registration = 'all', registeredIds = []) {
  const registeredSet = registeredIds instanceof Set ? registeredIds : new Set(registeredIds.map(String));
  return (Array.isArray(items) ? items : []).filter((item) => {
    const registered = registeredSet.has(String(item?.channelId || ''));
    if (registration === 'registered') return registered;
    if (registration === 'unregistered') return !registered;
    return true;
  });
}

export function filterYoutubeSearchResults(items, minimumViews = 0) {
  const threshold = Number(minimumViews || 0);
  return (Array.isArray(items) ? items : []).filter((item) => Number(item?.viewCount || 0) >= threshold);
}

export function summarizeYoutubeVideoSearchResults(items, registeredIds = [], now = new Date()) {
  const source = Array.isArray(items) ? items : [];
  const registeredSet = registeredIds instanceof Set ? registeredIds : new Set(registeredIds.map(String));
  const nowTime = now instanceof Date ? now.getTime() : new Date(now).getTime();
  const countSinceDays = (days) => {
    if (!Number.isFinite(nowTime)) return 0;
    const cutoff = nowTime - days * 86400000;
    return source.filter((item) => {
      const publishedTime = new Date(item?.publishedAt).getTime();
      return Number.isFinite(publishedTime) && publishedTime >= cutoff && publishedTime <= nowTime;
    }).length;
  };
  const channelIds = new Set(source.map((item) => String(item?.channelId || '')).filter(Boolean));
  const totalViews = source.reduce((sum, item) => sum + Number(item?.viewCount || 0), 0);
  const channelAppearances = new Map();
  source.forEach((item) => {
    const channelId = String(item?.channelId || '');
    if (!channelId || registeredSet.has(channelId)) return;
    const current = channelAppearances.get(channelId) || {
      channelId,
      count: 0,
      title: String(item?.channelTitle || '이름 미확인 채널'),
      totalViews: 0,
    };
    current.count += 1;
    current.totalViews += Number(item?.viewCount || 0);
    channelAppearances.set(channelId, current);
  });

  return {
    averageViews: source.length > 0 ? Math.round(totalViews / source.length) : 0,
    last7Days: countSinceDays(7),
    last30Days: countSinceDays(30),
    last60Days: countSinceDays(60),
    totalResults: source.length,
    uniqueChannels: channelIds.size,
    unregisteredChannels: [...channelIds].filter((channelId) => !registeredSet.has(channelId)).length,
    repeatedUnregisteredChannels: [...channelAppearances.values()]
      .filter((channel) => channel.count >= 2)
      .sort((left, right) => right.count - left.count || right.totalViews - left.totalViews)
      .slice(0, 3),
  };
}

export function toDiscoveryLinkPayload(video, query, tags = []) {
  return {
    url: video.url || `https://www.youtube.com/watch?v=${video.videoId}`,
    platform: 'youtube',
    title: video.title || '',
    linkedVideoId: video.videoId || '',
    status: 'inbox',
    tags: [...new Set((Array.isArray(tags) ? tags : []).map((tag) => String(tag || '').trim()).filter(Boolean))],
    memo: [`키워드 검색: ${String(query || '').trim()}`, video.channelTitle ? `채널: ${video.channelTitle}` : '']
      .filter(Boolean)
      .join(' · '),
  };
}
