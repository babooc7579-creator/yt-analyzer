export const KEYWORD_EXPLORER_RESULT_LIMIT = 60;

export const KEYWORD_LENGTH_OPTIONS = [
  { value: 'all', label: '전체 길이' },
  { value: 'shorts', label: '쇼츠' },
  { value: 'long', label: '롱폼' },
];

export const KEYWORD_AGE_OPTIONS = [
  { value: 'all', label: '업로드 시기 전체' },
  { value: 'recent30', label: '최근 30일' },
  { value: 'recent90', label: '최근 90일' },
  { value: 'legacy180', label: '6개월 이상' },
];

export const KEYWORD_VIEW_OPTIONS = [
  { value: 0, label: '조회수 전체' },
  { value: 10000, label: '1만 이상' },
  { value: 100000, label: '10만 이상' },
  { value: 1000000, label: '100만 이상' },
];

export const KEYWORD_SORT_OPTIONS = [
  { value: 'relevance', label: '관련도순' },
  { value: 'multiplier', label: '대박 지수순' },
  { value: 'views', label: '조회수순' },
  { value: 'newest', label: '최근 영상순' },
  { value: 'oldest', label: '오래된 영상순' },
];

const KEYWORD_STOP_WORDS = new Set([
  'short',
  'shorts',
  'video',
  'with',
  'from',
  'that',
  'this',
  '영상',
  '하는',
  '있는',
  '그리고',
]);

const toArray = (items) => (Array.isArray(items) ? items : []);

const toNumber = (value) => {
  const numericValue = Number(value || 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

export const normalizeKeywordText = (value) => (
  String(value || '').trim().toLocaleLowerCase('ko-KR')
);

export const tokenizeKeywordText = (value) => (
  normalizeKeywordText(value)
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 2 && !KEYWORD_STOP_WORDS.has(token) && !/^\d+$/.test(token))
);

export const getKeywordSuggestions = (videos, limit = 12) => {
  const counts = new Map();

  toArray(videos).forEach((video) => {
    const titleTokens = new Set(tokenizeKeywordText(video?.title));
    titleTokens.forEach((token) => counts.set(token, (counts.get(token) || 0) + 1));
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], 'ko-KR'))
    .slice(0, Math.max(0, Number(limit) || 0))
    .map(([label, count]) => ({ label, count }));
};

const getSearchScore = (video, query, tokens) => {
  const title = normalizeKeywordText(video?.title);
  const channelTitle = normalizeKeywordText(video?.channel_title || video?.channelTitle);
  let score = title.includes(query) ? 100 : 0;

  tokens.forEach((token) => {
    if (title.includes(token)) score += 10;
    if (channelTitle.includes(token)) score += 2;
  });

  return score;
};

const matchesAgeFilter = (video, ageFilter) => {
  const daysOld = toNumber(video?.daysOld);
  if (ageFilter === 'recent30') return daysOld <= 30;
  if (ageFilter === 'recent90') return daysOld <= 90;
  if (ageFilter === 'legacy180') return daysOld >= 180;
  return true;
};

const sortKeywordVideos = (videos, sortType, query, tokens) => {
  const result = [...videos];

  if (sortType === 'multiplier') {
    return result.sort((left, right) => toNumber(right.multiplier) - toNumber(left.multiplier));
  }
  if (sortType === 'views') {
    return result.sort((left, right) => toNumber(right.view_count) - toNumber(left.view_count));
  }
  if (sortType === 'newest') {
    return result.sort((left, right) => toNumber(left.daysOld) - toNumber(right.daysOld));
  }
  if (sortType === 'oldest') {
    return result.sort((left, right) => toNumber(right.daysOld) - toNumber(left.daysOld));
  }

  return result.sort((left, right) => (
    getSearchScore(right, query, tokens) - getSearchScore(left, query, tokens)
    || toNumber(right.multiplier) - toNumber(left.multiplier)
  ));
};

export const filterKeywordExplorerVideos = ({
  ageFilter = 'all',
  lengthFilter = 'all',
  minimumViews = 0,
  searchQuery = '',
  sortType = 'relevance',
  videos,
} = {}) => {
  const query = normalizeKeywordText(searchQuery);
  const queryTokens = tokenizeKeywordText(query);
  if (!query || queryTokens.length === 0) return [];

  const minimumViewCount = toNumber(minimumViews);
  const result = toArray(videos)
    .filter((video) => video && typeof video === 'object')
    .filter((video) => {
      const searchableText = normalizeKeywordText([
        video.title,
        video.channel_title,
        video.channelTitle,
      ].join(' '));
      return queryTokens.every((token) => searchableText.includes(token));
    })
    .filter((video) => minimumViewCount === 0 || toNumber(video.view_count) >= minimumViewCount)
    .filter((video) => matchesAgeFilter(video, ageFilter))
    .filter((video) => {
      if (lengthFilter === 'shorts') return Boolean(video.isShorts);
      if (lengthFilter === 'long') return !video.isShorts;
      return true;
    });

  return sortKeywordVideos(result, sortType, query, queryTokens);
};

export const getKeywordExplorerSummary = ({
  matchedVideos,
  shownVideoCount,
  videos,
} = {}) => {
  const matches = toArray(matchedVideos);
  const channelCount = new Set(
    matches.map((video) => video.channel_id || video.channelId || video.channel_title).filter(Boolean)
  ).size;
  const totalViews = matches.reduce((sum, video) => sum + toNumber(video.view_count), 0);
  const strongestMultiplier = matches.reduce((maximum, video) => (
    Math.max(maximum, toNumber(video.multiplier))
  ), 0);

  return {
    averageViews: matches.length > 0 ? Math.round(totalViews / matches.length) : 0,
    channelCount,
    loadedVideoCount: toArray(videos).length,
    matchedVideoCount: matches.length,
    shownVideoCount: Number(shownVideoCount || 0),
    strongestMultiplier,
  };
};

export const getKeywordExplorerEmptyState = ({
  hasQuery = false,
  loadedVideoCount = 0,
  selectedChannelCount = 0,
} = {}) => {
  if (loadedVideoCount === 0) {
    return {
      action: selectedChannelCount > 0 ? 'load' : 'channels',
      actionLabel: selectedChannelCount > 0 ? '선택 채널 저장 영상 불러오기' : '오늘 볼 채널 열기',
      description: selectedChannelCount > 0
        ? `선택한 채널 ${selectedChannelCount}개의 Cloud 저장 영상을 불러오면 키워드 검색을 시작할 수 있습니다.`
        : '1. 오늘 볼 채널에서 채널을 선택한 뒤, 2. 이 화면으로 돌아와 Cloud 저장 영상을 불러오세요. 채널을 여는 것만으로 YouTube API를 호출하지 않습니다.',
      title: '검색할 저장 영상이 없습니다',
    };
  }

  if (!hasQuery) {
    return {
      action: 'none',
      actionLabel: '',
      description: '영상 제목이나 채널명에서 찾고 싶은 단어를 입력하거나, 현재 제목에서 자주 나온 추천 검색어를 선택하세요.',
      title: '찾고 싶은 소재 키워드를 입력하세요',
    };
  }

  return {
    action: 'reset',
    actionLabel: '검색 조건 초기화',
    description: '현재 키워드와 필터 조건에 맞는 저장 영상이 없습니다.',
    title: '일치하는 영상이 없습니다',
  };
};
