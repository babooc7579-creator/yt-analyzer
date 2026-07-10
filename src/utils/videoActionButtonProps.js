const toDisplayTitle = (videoTitle) => videoTitle || '이 영상';

const noop = () => {};

const toVideoObject = (video) => (
  video && typeof video === 'object' ? video : {}
);

export const getVideoScrapActionCopy = ({
  isSaved,
  videoTitle,
}) => {
  const displayTitle = toDisplayTitle(videoTitle);
  const actionText = isSaved
    ? 'Cloud 스크랩북에서 보관을 해제합니다.'
    : 'Cloud 스크랩북에 소재로 보관합니다.';

  return {
    ariaLabel: `${displayTitle} ${isSaved ? 'Cloud 스크랩북에서 보관 해제' : 'Cloud 스크랩북에 소재로 보관'}, YouTube API 호출 없음`,
    buttonLabel: isSaved ? '보관 해제' : '소재 보관',
    thumbnailLabel: isSaved ? '보관됨' : '소재 보관',
    title: `${actionText} YouTube API를 새로 호출하지 않습니다.`,
  };
};

export const getVideoScrapButtonActionProps = ({
  isSaved,
  onToggleScrap,
  video,
  videoTitle,
} = {}) => {
  const safeVideo = toVideoObject(video);
  const copy = getVideoScrapActionCopy({ isSaved, videoTitle });
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

export const getVideoProductionCandidateActionCopy = ({
  isProductionCandidate,
  videoTitle,
}) => {
  const displayTitle = toDisplayTitle(videoTitle);
  const title = isProductionCandidate
    ? '이미 Cloud 판단 기록에 제작 후보로 표시되어 제작 후보함에 표시됩니다. YouTube API를 새로 호출하지 않습니다.'
    : 'Cloud 판단 기록에 제작 후보로 표시하고 제작 후보함에서 이어서 관리합니다. YouTube API를 새로 호출하지 않습니다.';

  return {
    ariaLabel: `${displayTitle} ${isProductionCandidate ? '이미 Cloud 판단 기록에 제작 후보로 표시되어 제작 후보함에 표시됨' : 'Cloud 판단 기록에 제작 후보로 표시하고 제작 후보함에서 관리'}, YouTube API 호출 없음`,
    buttonLabel: isProductionCandidate ? '후보 표시됨' : '제작 후보로',
    title,
  };
};

export const getVideoProductionCandidateButtonActionProps = ({
  isProductionCandidate,
  onPromoteToProduction,
  video,
  videoTitle,
} = {}) => {
  const safeVideo = toVideoObject(video);
  const copy = getVideoProductionCandidateActionCopy({ isProductionCandidate, videoTitle });
  const canPromote = Boolean(safeVideo.videoId)
    && typeof onPromoteToProduction === 'function'
    && !isProductionCandidate;

  return {
    ...copy,
    disabled: !canPromote,
    onClick: canPromote ? () => onPromoteToProduction(safeVideo) : noop,
    title: canPromote || isProductionCandidate
      ? copy.title
      : '제작 후보로 표시할 영상 ID가 없어 Cloud 판단 기록 저장을 실행하지 않습니다.',
  };
};

export const getVideoSelectionActionCopy = ({
  isChecked,
  videoTitle,
}) => {
  const displayTitle = toDisplayTitle(videoTitle);

  return {
    ariaLabel: `${displayTitle} AI 요청문 포함 선택 ${isChecked ? '해제' : '추가'}, API 호출 없음`,
    title: 'AI API를 호출하지 않고, 나중에 복사할 요청문에 포함할 영상으로 선택합니다.',
  };
};
