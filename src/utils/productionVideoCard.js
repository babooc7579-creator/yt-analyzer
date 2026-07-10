import {
  getRadarPriorityLabel,
  getRadarReasons,
  getRadarScore,
} from './radarCandidates';
import { getYouTubeVideoUrl } from './urls';

const noop = () => {};

export const getProductionVideoCardViewProps = ({
  columnId,
  isDirty,
  moveState,
  onMove,
  onSave,
  onUpdateDraft,
  record,
  saveState,
  scheduleSignal,
  video,
}) => {
  const videoTitle = video.title || '제목 없는 영상';
  const videoUrl = getYouTubeVideoUrl(video.videoId);
  const isSaving = saveState === 'saving';
  const isMoving = moveState === 'saving';
  const radarScore = Math.round(getRadarScore(video));

  return {
    candidateReasonsProps: {
      priorityLabel: getRadarPriorityLabel(radarScore),
      radarScore,
      reasons: getRadarReasons(video),
    },
    draftFormProps: {
      isDirty,
      isSaving,
      onSave,
      onUpdateDraft,
      record,
      saveState,
      video,
      videoTitle,
    },
    metaBadgesProps: {
      columnId,
      scheduleSignal,
      video,
    },
    statusActionsProps: {
      columnId,
      isMoving,
      moveState,
      onMove,
      record,
      video,
      videoTitle,
      videoUrl,
    },
    thumbnailAlt: `${videoTitle} 썸네일`,
    titleLinkAriaLabel: `${videoTitle} YouTube 원본 영상 열기`,
    videoTitle,
    videoUrl,
  };
};

export const getProductionVideoCandidateReasonsViewProps = ({
  priorityLabel,
  radarScore = 0,
} = {}) => ({
  label: '후보 근거',
  scoreText: `${priorityLabel} · ${radarScore}점`,
});

export const getProductionVideoDraftFieldsViewProps = ({ videoTitle = '이 영상' } = {}) => ({
  titleField: {
    label: '내가 만들 제목',
    placeholder: '내 채널에 맞게 바꿀 제목 초안',
    title: '입력만으로는 Cloud에 저장되지 않습니다. 아래 Cloud에 변경 저장 버튼을 눌러야 반영됩니다.',
    'aria-label': `${videoTitle} 내가 만들 제목 입력`,
  },
  noteField: {
    label: '메모',
    placeholder: '훅 포인트, 참고할 장면, 만들 방향',
    title: '입력만으로는 Cloud에 저장되지 않습니다. 아래 Cloud에 변경 저장 버튼을 눌러야 반영됩니다.',
    'aria-label': `${videoTitle} 제작 메모 입력`,
  },
  publishDateField: {
    label: '업로드 예정일',
    title: '입력만으로는 Cloud에 저장되지 않습니다. 아래 Cloud에 변경 저장 버튼을 눌러야 반영됩니다.',
    'aria-label': `${videoTitle} 업로드 예정일 선택`,
  },
});

export const getProductionVideoDraftFieldProps = ({
  fieldName,
  onUpdateDraft,
  videoId,
} = {}) => {
  const canUpdate = Boolean(videoId) && Boolean(fieldName) && typeof onUpdateDraft === 'function';

  return {
    disabled: !canUpdate,
    onChange: canUpdate
      ? (event) => onUpdateDraft(videoId, { [fieldName]: event?.target?.value || '' })
      : noop,
    title: canUpdate
      ? ''
      : '저장할 영상 ID가 없어 제작 메모를 수정할 수 없습니다.',
  };
};

export const getProductionVideoExternalActionsViewProps = ({
  videoTitle = '이 영상',
  videoUrl,
} = {}) => ({
  copyUrlButtonProps: {
    url: videoUrl,
    label: 'URL 복사',
    copiedLabel: '복사 완료',
    ariaLabel: `${videoTitle} YouTube 원본 URL 복사`,
    title: 'YouTube 원본 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다.',
  },
  openButtonProps: {
    title: 'YouTube 원본 영상 열기',
    'aria-label': `${videoTitle} YouTube 원본 보기`,
  },
  openButtonLabel: '원본 보기',
});

export const getProductionVideoMetaBadgesViewProps = ({ video = {} } = {}) => ({
  channelLabel: video.channel_title || video.channelTitle || '채널 정보 없음',
  multiplierLabel: video.multiplier !== undefined
    ? `대박 지수 ${Number(video.multiplier || 0).toFixed(1)}x`
    : '',
});
