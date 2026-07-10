const getDisplayVideoTitle = (videoTitle) => videoTitle || '이 영상';

const noop = () => {};

const toVideoObject = (video) => (
  video && typeof video === 'object' ? video : {}
);

export const getRadarCandidateCompletedStateViewProps = () => ({
  titleText: '오늘 볼 후보를 모두 처리했습니다',
  descriptionText: '봤음, 나중에 보기, 제작 후보, 제외로 판단한 후보는 Cloud 판단 기록에 저장되고 오늘의 레이더에서 숨겨집니다. 실수한 항목은 아래 처리 기록에서 되돌릴 수 있습니다.',
  openVaultButtonProps: {
    label: '레퍼런스 금고 열기',
    title: '저장된 영상 조회 화면으로 이동',
    'aria-label': '저장된 영상 조회 화면으로 이동',
  },
  clearDecisionsButtonProps: {
    label: '판단 기록 초기화',
    title: 'Cloud에 저장된 판단 기록을 초기화',
    'aria-label': 'Cloud에 저장된 오늘 레이더 판단 기록 초기화',
  },
});

export const getRadarCandidateEmptyStateViewProps = () => ({
  titleText: '오늘 볼 후보',
  descriptionText: '아직 화면에 불러온 영상이 없습니다. 선택한 채널의 저장된 영상을 불러오면 여기에서 오늘 먼저 볼 후보를 보여줍니다.',
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
  video,
  videoTitle,
} = {}) => {
  const safeVideo = toVideoObject(video);
  const copy = getRadarCandidateProductionButtonProps({ videoTitle });
  const canPromote = Boolean(safeVideo.videoId) && typeof onPromoteToProduction === 'function';

  return {
    ...copy,
    disabled: !canPromote,
    onClick: canPromote ? () => onPromoteToProduction(safeVideo) : noop,
    title: canPromote
      ? copy.title
      : '제작 후보로 표시할 영상 ID가 없어 Cloud 판단 기록 저장을 실행하지 않습니다.',
  };
};

export const getRadarCandidateDecisionActionsViewProps = () => ({
  descriptionText: '2. 판단 결과는 Cloud 판단 기록에 저장되고 오늘 레이더에서 숨겨집니다. YouTube API를 새로 호출하지 않습니다.',
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
  video,
  videoTitle,
} = {}) => {
  const safeVideo = toVideoObject(video);
  const copy = getRadarCandidateScrapButtonProps({ isSaved, videoTitle });
  const canToggleScrap = Boolean(safeVideo.videoId) && typeof onToggleScrap === 'function';

  return {
    ...copy,
    disabled: !canToggleScrap,
    onClick: canToggleScrap ? () => onToggleScrap(safeVideo) : noop,
    title: canToggleScrap
      ? copy.title
      : '보관할 영상 ID가 없어 Cloud 스크랩북 저장을 실행하지 않습니다.',
  };
};
