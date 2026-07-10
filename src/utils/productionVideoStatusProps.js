import { PRODUCTION_STATUS } from '../constants/status';

const getDisplayVideoTitle = (videoTitle) => videoTitle || '이 영상';
const noop = () => {};

export const PRODUCTION_VIDEO_STATUS_HELP_TEXT =
  '아래 상태 버튼은 이 영상의 제작 진행 상태를 Cloud 판단 기록에 저장합니다. YouTube API를 새로 호출하지 않습니다.';

const MOVE_ACTION_COPY = {
  [PRODUCTION_STATUS.CANDIDATE]: {
    ariaAction: '제작 후보 상태로 변경, Cloud 판단 기록 저장, YouTube API 호출 없음',
    label: '제작 후보로',
    title: '제작 진행 상태를 제작 후보로 변경해 Cloud 판단 기록에 저장합니다. YouTube API를 새로 호출하지 않습니다.',
  },
  [PRODUCTION_STATUS.ACTIVE]: {
    ariaAction: '제작 중 상태로 변경, Cloud 판단 기록 저장, YouTube API 호출 없음',
    label: '제작 중으로',
    title: '제작 진행 상태를 제작 중으로 변경해 Cloud 판단 기록에 저장합니다. YouTube API를 새로 호출하지 않습니다.',
  },
  [PRODUCTION_STATUS.DONE]: {
    ariaAction: '업로드 완료 상태로 변경, Cloud 판단 기록 저장, YouTube API 호출 없음',
    label: '업로드 완료',
    title: '제작 진행 상태를 업로드 완료로 변경하고 완료일을 Cloud 판단 기록에 저장합니다. YouTube API를 새로 호출하지 않습니다.',
  },
};

export const getProductionVideoMoveActionCopy = ({ targetStatus, videoTitle } = {}) => {
  const copy = MOVE_ACTION_COPY[targetStatus] || MOVE_ACTION_COPY[PRODUCTION_STATUS.CANDIDATE];
  const displayTitle = getDisplayVideoTitle(videoTitle);

  return {
    ariaLabel: `${displayTitle} ${copy.ariaAction}`,
    label: copy.label,
    title: copy.title,
  };
};

export const getProductionVideoDraftSaveButtonProps = ({
  hasSaveTarget = true,
  isDirty,
  isSaving,
  videoTitle,
} = {}) => {
  const displayTitle = getDisplayVideoTitle(videoTitle);
  const canSave = Boolean(hasSaveTarget) && Boolean(isDirty) && !isSaving;
  let label = 'Cloud 저장됨';
  let title = '제작 제목, 메모, 업로드 예정일이 Cloud 판단 기록에 저장된 상태입니다. YouTube API를 새로 호출하지 않습니다.';

  if (isSaving) {
    label = 'Cloud 저장 중';
    title = '제작 제목, 메모, 업로드 예정일을 Cloud 판단 기록에 저장하는 중입니다. YouTube API를 새로 호출하지 않습니다.';
  } else if (!hasSaveTarget) {
    label = '저장 대상 없음';
    title = '저장할 영상 ID가 없어 Cloud 저장을 실행하지 않습니다.';
  } else if (isDirty) {
    label = 'Cloud에 변경 저장';
    title = '제작 제목, 메모, 업로드 예정일을 Cloud 판단 기록에 저장합니다. YouTube API를 새로 호출하지 않습니다.';
  }

  return {
    ariaLabel: `${displayTitle} 제작 메모 Cloud 판단 기록에 저장, YouTube API 호출 없음`,
    disabled: !canSave,
    label,
    title,
  };
};

export const getProductionVideoDraftSaveHandler = ({
  onSave,
  videoId,
} = {}) => (
  videoId && typeof onSave === 'function'
    ? () => onSave(videoId)
    : noop
);

export const getProductionVideoMoveStatusViewProps = ({
  columnId,
  moveState,
  uploadedAt,
} = {}) => ({
  errorMessage: moveState === 'error'
    ? 'Cloud 상태 저장 실패. 저장 완료 처리하지 않았습니다. 다시 눌러 주세요.'
    : '',
  uploadedAtText: columnId === PRODUCTION_STATUS.DONE
    ? `업로드 완료일 ${uploadedAt || '기록 없음'}`
    : '',
});

export const getProductionVideoSaveStatusViewProps = (saveState) => {
  if (saveState === 'saved') {
    return {
      iconName: 'saved',
      message: 'Cloud에 저장됐습니다.',
      tone: 'success',
    };
  }

  if (saveState === 'error') {
    return {
      iconName: 'error',
      message: 'Cloud 저장 실패. 저장 완료 처리하지 않았습니다. 다시 저장해 주세요.',
      tone: 'danger',
    };
  }

  return null;
};

export const getProductionVideoMoveButtonViewProps = ({
  disabled = false,
  isMoving = false,
  label,
  loadingLabel = '변경 중...',
} = {}) => ({
  disabled: Boolean(disabled) || isMoving,
  visibleLabel: isMoving ? loadingLabel : label,
});

export const getProductionVideoMoveHandler = ({
  onMove,
  targetStatus,
  updates,
  videoId,
} = {}) => (
  videoId && typeof onMove === 'function'
    ? () => onMove(videoId, targetStatus, updates)
    : noop
);
