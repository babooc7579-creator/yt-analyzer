const toCount = (value) => (Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0);

export const hasEmptyStoredVideoLoad = (storedVideoLoadResult) => (
  storedVideoLoadResult?.success === true && toCount(storedVideoLoadResult.videoCount) === 0
);

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
      title: '오늘 볼 채널 고르기',
      value: selectedChannels > 0 ? `${selectedChannels}개 선택` : '선택 필요',
      status: channelStatus,
    },
    {
      key: 'load',
      number: 2,
      title: '저장 영상 불러오기',
      value: emptyLoad ? '저장 영상 0개' : loadedVideos > 0 ? `${loadedVideos}개 준비` : 'Cloud DB 조회',
      status: loadStatus,
      warning: emptyLoad,
    },
    {
      key: 'review',
      number: 3,
      title: '오늘 후보 판단',
      value: radarCandidates > 0 ? `${radarCandidates}개 남음` : loadedVideos > 0 ? '판단 완료' : '영상 준비 후',
      status: reviewStatus,
    },
    {
      key: 'production',
      number: 4,
      title: '제작 후보 결정',
      value: productionCandidates > 0 ? `${productionCandidates}개 후보` : '다음 소재 결정',
      status: productionStatus,
    },
  ];
};
