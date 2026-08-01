import { VIDEO_RECORDS_FULL_CLEAR_SAFETY_PROPS } from '../constants/syncWarnings';
import { hasEmptyStoredVideoLoad } from './homeRadarJourney';

const getDisplayVideoTitle = (videoTitle) => videoTitle || '이 영상';

const noop = () => {};

const toVideoObject = (video) => (
  video && typeof video === 'object' ? video : {}
);

export const getRadarCandidateCompletedStateViewProps = () => ({
  titleText: '오늘 볼 후보를 모두 처리했습니다',
  descriptionText: '봤음, 나중에 보기, 제작 후보, 제외로 판단한 후보는 온라인 저장소(Azure DB)의 판단 기록에 저장되고 오늘의 레이더에서 숨겨집니다. 검토 중·제작 결정·제작 중·보류·업로드 완료 영상은 제작 후보함에서 계속 찾을 수 있습니다. 실수한 판단은 아래 처리 기록에서 되돌릴 수 있습니다.',
  openVaultButtonProps: {
    label: '수집 영상 목록 열기',
    title: '수집 영상 목록 화면으로 이동합니다. 이동만으로 온라인 저장소(Azure DB) 조회나 YouTube API 호출은 실행되지 않습니다.',
    'aria-label': '수집 영상 목록 화면 열기, 이동만으로 온라인 저장소(Azure DB) 조회 및 YouTube API 호출 없음',
  },
  openProductionButtonProps: {
    label: '제작 후보함 열기',
    title: '제작 후보로 표시한 영상과 발견함 링크를 확인합니다. 저장된 후보 조회이며 YouTube API를 새로 호출하지 않습니다.',
    'aria-label': '제작 후보함 열기, 저장된 후보 조회이며 YouTube API 호출 없음',
  },
  clearDecisionsButtonProps: {
    ...VIDEO_RECORDS_FULL_CLEAR_SAFETY_PROPS,
  },
});

export const getRadarCandidateEmptyStateViewProps = ({
  selectedChannelCount = 0,
  storedVideoLoadResult,
} = {}) => {
  const emptyStoredVideoLoad = hasEmptyStoredVideoLoad(storedVideoLoadResult);

  return ({
    titleText: '오늘 볼 후보',
    descriptionText: emptyStoredVideoLoad
      ? `선택한 채널 ${selectedChannelCount}개의 온라인 저장소(Azure DB) 조회는 정상적으로 끝났지만 수집된 영상 정보가 없습니다. 다른 채널을 고르거나 새 영상 수집 화면으로 이동하세요.`
      : selectedChannelCount > 0
        ? `선택한 채널 ${selectedChannelCount}개의 영상이 아직 화면에 없습니다. 수집 영상 목록 불러오기를 누르면 온라인 저장소(Azure DB)에서 조회해 오늘 먼저 볼 후보를 보여줍니다. YouTube API는 호출하지 않습니다.`
        : '아직 선택한 채널이 없습니다. 오늘 볼 채널에서 채널을 먼저 고른 뒤 수집 영상을 불러오면 오늘 후보를 보여줍니다. 채널 선택만으로 YouTube API를 호출하지 않습니다.',
    channelWatchlistButtonProps: {
      label: emptyStoredVideoLoad ? '다른 채널 고르기' : '오늘 볼 채널 고르기',
      title: '오늘 볼 채널 화면으로 이동합니다. 이동과 채널 선택만으로 YouTube API를 호출하지 않습니다.',
      'aria-label': '오늘 볼 채널 화면 열기, 이동과 채널 선택만으로 YouTube API 호출 없음',
      show: selectedChannelCount === 0 || emptyStoredVideoLoad,
    },
    selectedScanButtonProps: {
      label: '새 영상 수집 화면 열기',
      title: '선택 채널 새 영상 수집 화면으로 이동합니다. 이동만으로 수집은 실행되지 않으며 실제 수집 버튼에서 YouTube API를 사용할 수 있습니다.',
      'aria-label': '선택 채널 새 영상 수집 화면 열기, 이동만으로 YouTube API 호출 없음',
      show: emptyStoredVideoLoad,
    },
    openVaultButtonProps: {
      label: '수집 영상 목록 열기',
      title: '수집 영상 목록 화면으로 이동합니다. 이동만으로 온라인 저장소(Azure DB) 조회나 YouTube API 호출은 실행되지 않습니다.',
      'aria-label': '수집 영상 목록 화면 열기, 이동만으로 온라인 저장소(Azure DB) 조회 및 YouTube API 호출 없음',
    },
    hideLoadButton: emptyStoredVideoLoad,
  });
};

export const getRadarCandidateProductionButtonProps = ({ videoTitle } = {}) => {
  const displayTitle = getDisplayVideoTitle(videoTitle);

  return {
    label: '제작 후보로',
    title: '소재 보관과 별도로 제작 후보 원본 정보를 유지하고 온라인 저장소(Azure DB)의 판단 기록에 제작 후보로 표시합니다. YouTube API를 새로 호출하지 않습니다.',
    'aria-label': `${displayTitle} 소재 보관과 별도로 제작 후보 원본 정보를 유지하고 온라인 저장소(Azure DB)의 판단 기록에 제작 후보로 표시, YouTube API 호출 없음`,
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
      ? '다른 온라인 저장소(Azure DB)의 기록 저장이 끝날 때까지 기다려 주세요.'
      : canPromote
        ? copy.title
        : '제작 후보로 표시할 영상 ID가 없어 온라인 저장소(Azure DB)의 판단 기록 저장을 실행하지 않습니다.',
  };
};

export const getRadarCandidateDecisionActionsViewProps = ({ pendingAction } = {}) => ({
  descriptionText: '만들 만하면 제작 후보로 표시하세요. 소재 보관은 소재 보관함에만 저장하고 현재 후보를 유지합니다. 봤음, 나중에 보기, 제외는 온라인 저장소(Azure DB)의 판단 기록에 저장되고 다음 후보가 자동으로 이어집니다. YouTube API를 새로 호출하지 않습니다.',
  pendingText: {
    production: '제작 후보 원본 정보와 후보 표시를 온라인 저장소(Azure DB)에 저장하는 중입니다.',
    scrapbook: '소재 보관 상태를 온라인 저장소(Azure DB)에 저장하는 중입니다.',
    status: '영상 판단 기록을 온라인 저장소(Azure DB)에 저장하는 중입니다.',
  }[pendingAction] || '',
});

export const getRadarCandidateActionErrorMessage = (actionKey) => ({
  production: '제작 후보 표시를 온라인 저장소(Azure DB)에 저장하지 못했습니다. 상단 연결 안내를 확인하고 다시 눌러 주세요.',
  scrapbook: '소재 보관 상태를 온라인 저장소(Azure DB)에 저장하지 못했습니다. 상단 연결 안내를 확인하고 다시 눌러 주세요.',
  status: '영상 판단을 온라인 저장소(Azure DB)에 저장하지 못했습니다. 상단 연결 안내를 확인하고 다시 눌러 주세요.',
}[actionKey] || '온라인 저장소(Azure DB) 저장을 완료하지 못했습니다. 상단 연결 안내를 확인하고 다시 시도해 주세요.');

export const getRadarCandidateScrapButtonProps = ({
  isSaved = false,
  videoTitle,
} = {}) => {
  const displayTitle = getDisplayVideoTitle(videoTitle);
  const actionText = isSaved
    ? '온라인 저장소(Azure DB)의 소재 보관함에서 보관을 해제합니다'
    : '온라인 저장소(Azure DB)의 소재 보관함에 소재로 보관합니다';

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
      ? '다른 온라인 저장소(Azure DB)의 기록 저장이 끝날 때까지 기다려 주세요.'
      : canToggleScrap
        ? copy.title
        : '보관할 영상 ID가 없어 온라인 저장소(Azure DB)의 소재 보관함 저장을 실행하지 않습니다.',
  };
};
