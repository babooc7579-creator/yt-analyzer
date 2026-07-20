const toCount = (value) => (Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0);

export const hasEmptyStoredVideoLoad = (storedVideoLoadResult) => (
  storedVideoLoadResult?.success === true && toCount(storedVideoLoadResult.videoCount) === 0
);

export const getLoadedVideoCountForSelectedChannels = ({
  savedChannels = [],
  selectedChannelIds = [],
  videos = [],
} = {}) => {
  const selectedIds = new Set(Array.isArray(selectedChannelIds) ? selectedChannelIds : []);
  if (selectedIds.size === 0 || !Array.isArray(videos)) return 0;

  const selectedTitles = new Set((Array.isArray(savedChannels) ? savedChannels : [])
    .filter((channel) => selectedIds.has(channel?.id || channel?.channelId))
    .map((channel) => String(channel?.title || channel?.channel_title || '').trim())
    .filter(Boolean));

  return videos.filter((video) => {
    const channelId = String(video?.channel_id || video?.channelId || '').trim();
    const channelTitle = String(video?.channel_title || video?.channelTitle || '').trim();
    return (channelId && selectedIds.has(channelId))
      || (!channelId && channelTitle && selectedTitles.has(channelTitle));
  }).length;
};

export const getHomeRadarJourneyStages = ({
  loadedVideoCount = 0,
  openRadarCandidateCount = 0,
  productionCandidateCount = 0,
  selectedChannelCount = 0,
  storedVideoLoadResult,
} = {}) => {
  const selectedChannels = toCount(selectedChannelCount);
  const loadedVideos = toCount(loadedVideoCount);
  const radarCandidates = toCount(openRadarCandidateCount);
  const productionCandidates = toCount(productionCandidateCount);
  const emptyLoad = hasEmptyStoredVideoLoad(storedVideoLoadResult);

  const channelStatus = selectedChannels > 0 ? 'complete' : 'current';
  const loadStatus = selectedChannels === 0
    ? 'upcoming'
    : loadedVideos > 0
      ? 'complete'
      : 'current';
  const reviewStatus = loadedVideos === 0
    ? 'upcoming'
    : radarCandidates > 0
      ? 'current'
      : 'complete';
  const productionStatus = radarCandidates > 0 || loadedVideos === 0
    ? 'upcoming'
    : productionCandidates > 0
      ? 'current'
      : 'ready';

  return [
    {
      key: 'channels',
      number: 1,
      href: '#today-radar-channels',
      title: '오늘 볼 채널 고르기',
      value: selectedChannels > 0 ? `${selectedChannels}개 선택` : '선택 필요',
      hint: '분야·등급·수집일로 범위를 좁힙니다.',
      status: channelStatus,
    },
    {
      key: 'load',
      number: 2,
      href: '#today-radar-load',
      title: '저장 영상 불러오기',
      value: emptyLoad ? '저장 영상 0개' : loadedVideos > 0 ? `${loadedVideos}개 준비` : 'Cloud DB 조회',
      hint: '저장 데이터만 조회하며 새 수집은 하지 않습니다.',
      status: loadStatus,
      warning: emptyLoad,
    },
    {
      key: 'review',
      number: 3,
      href: '#today-radar-candidates',
      title: '오늘 후보 판단',
      value: radarCandidates > 0 ? `${radarCandidates}개 남음` : loadedVideos > 0 ? '판단 완료' : '영상 준비 후',
      hint: '상위 6개를 보고 다음 행동을 정합니다.',
      status: reviewStatus,
    },
    {
      key: 'production',
      number: 4,
      href: '#today-radar-finish',
      title: '제작 후보 결정',
      value: productionCandidates > 0 ? `${productionCandidates}개 후보` : '다음 소재 결정',
      hint: '오늘 집중과 업로드 일정으로 이어갑니다.',
      status: productionStatus,
    },
  ];
};
