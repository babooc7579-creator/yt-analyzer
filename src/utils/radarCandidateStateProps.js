const getDisplayVideoTitle = (videoTitle) => videoTitle || '이 영상';

const noop = () => {};

const toVideoObject = (video) => (
  video && typeof video === 'object' ? video : {}
);

export const getRadarCandidateCompletedStateViewProps = () => ({
  titleText: '오늘 볼 후보를 모두 처리했습니다',
  descriptionText: '봤음, 나중에 보기, 제작 후보, 제외로 판단한 후보는 Cloud 판단 기록에 저장되고 오늘의 레이더에서 숨겨집니다. 실수한 항목은 아래 처리 기록에서 되돌릴 수 있고, 다음 작업은 저장 영상 탐색이나 제작 후보함에서 이어갈 수 있습니다.',
  openVaultButtonProps: {
    label: '레퍼런스 금고 열기',
    title: '저장된 영상 조회 화면으로 이동',
    'aria-label': '저장된 영상 조회 화면으로 이동',
  },
  openProductionButtonProps: {
    label: '제작 후보함 열기',
    title: '제작 후보로 표시한 영상과 발견함 링크를 확인합니다. 저장된 후보 조회이며 YouTube API를 새로 호출하지 않습니다.',
    'aria-label': '제작 후보함 열기, 저장된 후보 조회이며 YouTube API 호출 없음',
  },
  clearDecisionsButtonProps: {
    label: '판단 기록 초기화',
    title: 'Cloud에 저장된 판단 기록을 초기화',
    'aria-label': 'Cloud에 저장된 오늘 레이더 판단 기록 초기화',
  },
});

export const getRadarCandidateEmptyStateViewProps = ({ selectedChannelCount = 0 } = {}) => ({
  titleText: '오늘 볼 후보',
  descriptionText: selectedChannelCount > 0
    ? `선택한 채널 ${selectedChannelCount}개의 영상이 아직 화면에 없습니다. 저장 영상 불러오기를 누르면 Cloud DB에서 조회해 오늘 먼저 볼 후보를 보여줍니다. YouTube API는 호출하지 않습니다.`
    : '아직 선택한 채널이 없습니다. 오늘 볼 채널에서 채널을 먼저 고른 뒤 저장 영상을 불러오면 오늘 후보를 보여줍니다. 채널 선택만으로 YouTube API를 호출하지 않습니다.',
  channelWatchlistButtonProps: {
    label: '오늘 볼 채널 고르기',
    title: '오늘 볼 채널 화면으로 이동합니다. 이동과 채널 선택만으로 YouTube API를 호출하지 않습니다.',
    'aria-label': '오늘 볼 채널 화면 열기, 이동과 채널 선택만으로 YouTube API 호출 없음',
    show: selectedChannelCount === 0,
  },
  openVaultButtonProps: {
    label: '레퍼런스 금고 열기',
    title: '저장된 영상 조회 화면으로 이동',
    'aria-label': '저장된 영상 조회 화면으로 이동',
  },
});

export const getRadarCandidateProductionButtonProps = ({ videoTitle } = {}) => {
  const displayTitle = getDisplayVideoTitle(videoTitle);

  return {
    label: '제작 후보로',
    title: '스크랩북에 보관하고 Cloud 판단 기록에 제작 후보로 표시합니다. YouTube API를 새로 호출하지 않습니다.',
    'aria-label': `${displayTitle} 스크랩북에 보관하고 Cloud 판단 기록에 제작 후보로 표시, YouTube API 호출 없음`,
  };
};

export const getRadarCandidateProductionButtonActionProps = ({
  onPromoteToProduction,
  saving = false,
  video,
  videoTitle,
} = {}) => {
  const safeVideo = toVideoObject(video);
  const copy = getRadarCandidateProductionButtonProps({ videoTitle });
  const canPromote = Boolean(safeVideo.videoId)
    && typeof onPromoteToProduction === 'function'
    && !saving;

  return {
    ...copy,
    disabled: !canPromote,
    onClick: canPromote ? () => onPromoteToProduction(safeVideo) : noop,
    title: saving
      ? '다른 Cloud 기록 저장이 끝날 때까지 기다려 주세요.'
      : canPromote
        ? copy.title
        : '제작 후보로 표시할 영상 ID가 없어 Cloud 판단 기록 저장을 실행하지 않습니다.',
  };
};

export const getRadarCandidateDecisionActionsViewProps = ({ pendingAction } = {}) => ({
  descriptionText: '2. 좋으면 제작 후보로, 다시 볼 영상은 소재 보관, 애매하면 나중에 보기, 아니면 제외로 정리하세요. 판단 결과는 Cloud 판단 기록에 저장되고 오늘 레이더에서 숨겨집니다. YouTube API를 새로 호출하지 않습니다.',
  pendingText: {
    production: '스크랩북 보관과 제작 후보 표시를 Cloud에 저장하는 중입니다.',
    scrapbook: '스크랩북 보관 상태를 Cloud에 저장하는 중입니다.',
    status: '영상 판단 기록을 Cloud에 저장하는 중입니다.',
  }[pendingAction] || '',
});

export const getRadarCandidateScrapButtonProps = ({
  isSaved = false,
  videoTitle,
} = {}) => {
  const displayTitle = getDisplayVideoTitle(videoTitle);
  const actionText = isSaved
    ? 'Cloud 스크랩북에서 보관을 해제합니다'
    : 'Cloud 스크랩북에 소재로 보관합니다';

  return {
    actionText,
    buttonText: isSaved ? '보관 해제' : '소재 보관',
    title: actionText,
    'aria-label': `${displayTitle} ${actionText}`,
  };
};

export const getRadarCandidateScrapButtonActionProps = ({
  isSaved = false,
  onToggleScrap,
  saving = false,
  video,
  videoTitle,
} = {}) => {
  const safeVideo = toVideoObject(video);
  const copy = getRadarCandidateScrapButtonProps({ isSaved, videoTitle });
  const canToggleScrap = Boolean(safeVideo.videoId)
    && typeof onToggleScrap === 'function'
    && !saving;

  return {
    ...copy,
    disabled: !canToggleScrap,
    onClick: canToggleScrap ? () => onToggleScrap(safeVideo) : noop,
    title: saving
      ? '다른 Cloud 기록 저장이 끝날 때까지 기다려 주세요.'
      : canToggleScrap
        ? copy.title
        : '보관할 영상 ID가 없어 Cloud 스크랩북 저장을 실행하지 않습니다.',
  };
};
