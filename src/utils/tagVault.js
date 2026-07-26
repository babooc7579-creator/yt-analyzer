export const TAG_VAULT_RESULT_LIMIT = 60;

export const TAG_VAULT_LENGTH_OPTIONS = [
  { value: 'all', label: '전체 길이' },
  { value: 'shorts', label: '쇼츠' },
  { value: 'long', label: '롱폼' },
];

export const TAG_VAULT_SORT_OPTIONS = [
  { value: 'multiplier', label: '대박 지수순' },
  { value: 'views', label: '조회수순' },
  { value: 'newest', label: '최근 영상순' },
  { value: 'oldest', label: '오래된 영상순' },
];

const toArray = (items) => (Array.isArray(items) ? items : []);

const toNumber = (value) => {
  const numericValue = Number(value || 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const normalizeText = (value) => String(value || '').trim().toLocaleLowerCase('ko-KR');

const getChannelId = (channel) => String(channel?.id || channel?.channelId || '').trim();

const getVideoChannelId = (video) => String(video?.channel_id || video?.channelId || '').trim();

const getChannelLabels = (channel) => {
  const labels = [...toArray(channel?.tags), channel?.category]
    .map((label) => typeof label === 'string' ? label.trim() : '')
    .filter(Boolean);
  return [...new Set(labels)];
};

export const getTagVaultFacets = (channels) => {
  const facetMap = new Map();

  toArray(channels).forEach((channel) => {
    const channelId = getChannelId(channel);
    if (!channelId) return;

    getChannelLabels(channel).forEach((label) => {
      const current = facetMap.get(label) || { channelIds: [], label };
      if (!current.channelIds.includes(channelId)) current.channelIds.push(channelId);
      facetMap.set(label, current);
    });
  });

  return [...facetMap.values()]
    .map((facet) => ({ ...facet, channelCount: facet.channelIds.length }))
    .sort((left, right) => right.channelCount - left.channelCount || left.label.localeCompare(right.label, 'ko-KR'));
};

export const getTagVaultChannelIds = (channels, selectedTag) => {
  const facet = getTagVaultFacets(channels).find((item) => item.label === selectedTag);
  return facet?.channelIds || [];
};

const sortVideos = (videos, sortType) => {
  const result = [...videos];
  if (sortType === 'views') return result.sort((left, right) => toNumber(right.view_count) - toNumber(left.view_count));
  if (sortType === 'newest') return result.sort((left, right) => toNumber(left.daysOld) - toNumber(right.daysOld));
  if (sortType === 'oldest') return result.sort((left, right) => toNumber(right.daysOld) - toNumber(left.daysOld));
  return result.sort((left, right) => toNumber(right.multiplier) - toNumber(left.multiplier));
};

export const filterTagVaultVideos = ({
  channels,
  lengthFilter = 'all',
  searchQuery = '',
  selectedTag = '',
  sortType = 'multiplier',
  videos,
} = {}) => {
  if (!selectedTag) return [];

  const selectedChannels = toArray(channels).filter((channel) => getChannelLabels(channel).includes(selectedTag));
  const selectedChannelIds = new Set(selectedChannels.map(getChannelId).filter(Boolean));
  const selectedChannelTitles = new Set(selectedChannels
    .map((channel) => normalizeText(channel.title || channel.channelTitle || channel.name))
    .filter(Boolean));
  const query = normalizeText(searchQuery);

  const result = toArray(videos)
    .filter((video) => {
      const channelId = getVideoChannelId(video);
      const channelTitle = normalizeText(video?.channel_title || video?.channelTitle);
      return selectedChannelIds.has(channelId) || (!channelId && selectedChannelTitles.has(channelTitle));
    })
    .filter((video) => {
      if (!query) return true;
      return normalizeText([video.title, video.channel_title, video.channelTitle].join(' ')).includes(query);
    })
    .filter((video) => {
      if (lengthFilter === 'shorts') return Boolean(video.isShorts);
      if (lengthFilter === 'long') return !video.isShorts;
      return true;
    });

  return sortVideos(result, sortType);
};

export const getTagVaultSummary = ({
  channels,
  matchedVideos,
  selectedChannelIds,
  selectedTag,
  shownVideoCount,
  videos,
} = {}) => ({
  loadedVideoCount: toArray(videos).length,
  matchedVideoCount: toArray(matchedVideos).length,
  selectedChannelCount: toArray(selectedChannelIds).length,
  shownVideoCount: Number(shownVideoCount || 0),
  tagChannelCount: getTagVaultChannelIds(channels, selectedTag).length,
  tagCount: getTagVaultFacets(channels).length,
});

export const getTagVaultEmptyState = ({
  channelCount = 0,
  hasActiveFilters = false,
  loadedVideoCount = 0,
  selectedChannelCount = 0,
  tagCount = 0,
} = {}) => {
  if (channelCount === 0 || tagCount === 0) {
    return {
      action: 'channels',
      actionAriaLabel: '채널 목록 화면으로 이동, Cloud DB 조회 및 YouTube API 호출 없음',
      actionLabel: '채널 목록 열기',
      actionTitle: '채널 목록 화면으로 이동해 태그와 분류를 정리합니다. 이동만으로 Cloud DB 조회나 YouTube API 호출은 실행되지 않습니다.',
      description: channelCount === 0
        ? 'Cloud 채널 목록을 먼저 불러오면 채널 태그를 기준으로 금고를 만들 수 있습니다.'
        : '채널에 태그나 분류가 아직 없습니다. 채널 목록에서 태그를 먼저 정리하세요.',
      title: '사용할 채널 태그가 없습니다',
    };
  }

  if (loadedVideoCount === 0) {
    return {
      action: selectedChannelCount > 0 ? 'load' : 'select',
      actionAriaLabel: selectedChannelCount > 0
        ? `선택 채널 ${selectedChannelCount}개 저장 영상 불러오기, Cloud DB 조회이며 YouTube API 호출 없음`
        : '현재 태그 채널 선택, 선택만 실행하며 Cloud DB 조회 및 YouTube API 호출 없음',
      actionLabel: selectedChannelCount > 0 ? '선택 채널 저장 영상 불러오기' : '이 태그 채널 선택',
      actionTitle: selectedChannelCount > 0
        ? `Cloud DB에서 선택 채널 ${selectedChannelCount}개의 저장 영상을 조회합니다. 새 YouTube API 호출은 없습니다.`
        : '현재 태그에 속한 채널을 선택합니다. 선택만으로 Cloud DB 조회나 YouTube API 호출은 실행되지 않습니다.',
      description: selectedChannelCount > 0
        ? '현재 선택된 채널의 Cloud 저장 영상을 불러오세요. 이 작업은 YouTube API를 호출하지 않습니다.'
        : '1. 이 태그에 속한 채널을 선택한 뒤, 2. 상단의 저장 영상 불러오기를 누르세요. 선택만으로 YouTube API를 호출하지 않습니다.',
      title: '불러온 저장 영상이 없습니다',
    };
  }

  return {
    action: hasActiveFilters ? 'reset' : 'select',
    actionAriaLabel: hasActiveFilters
      ? '태그별 금고 화면 필터 초기화, Cloud 저장 및 YouTube API 호출 없음'
      : '현재 태그 채널 선택, 선택만 실행하며 Cloud DB 조회 및 YouTube API 호출 없음',
    actionLabel: hasActiveFilters ? '화면 필터 초기화' : '이 태그 채널 선택',
    actionTitle: hasActiveFilters
      ? '현재 검색어와 길이 필터를 초기화합니다. Cloud 데이터나 저장 상태는 바꾸지 않으며 YouTube API를 호출하지 않습니다.'
      : '현재 태그에 속한 채널을 선택합니다. 선택만으로 Cloud DB 조회나 YouTube API 호출은 실행되지 않습니다.',
    description: hasActiveFilters
      ? '현재 검색어와 길이 조건에 맞는 저장 영상이 없습니다.'
      : '이 태그 채널의 영상이 현재 불러온 저장 영상에 없습니다. 채널을 선택하고 다시 불러오세요.',
    title: '이 태그에서 표시할 영상이 없습니다',
  };
};
