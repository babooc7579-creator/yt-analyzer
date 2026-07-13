import {
  getRadarPriorityLabel,
  getRadarReasons,
  getRadarScore,
} from './radarCandidates';
import { PRODUCTION_FOCUS_COLUMN_ID } from '../constants/productionKanban';
import { PRODUCTION_STATUS_LABELS } from '../constants/status';
import { getYouTubeVideoUrl } from './urls';

const noop = () => {};

const hasText = (value) => (
  typeof value === 'string' ? value.trim().length > 0 : Boolean(value)
);

export const getProductionVideoCardViewProps = ({
  columnId,
  isDirty,
  moveState,
  onFocus,
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
    readinessChecklistProps: getProductionVideoReadinessChecklist({
      record,
      video,
    }),
    statusActionsProps: {
      columnId,
      isMoving,
      moveState,
      onFocus,
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

export const getProductionVideoReadinessChecklist = ({
  record,
  video,
} = {}) => {
  const safeRecord = record && typeof record === 'object' ? record : {};
  const safeVideo = video && typeof video === 'object' ? video : {};
  const items = [
    {
      key: 'source',
      isReady: Boolean(safeVideo.videoId),
      label: '원본 링크',
      missingText: '영상 ID 없음',
      readyText: '확인 가능',
      title: 'YouTube 원본 링크 확인용입니다. 화면 표시만 하며 YouTube API를 새로 호출하지 않습니다.',
    },
    {
      key: 'title',
      isReady: hasText(safeRecord.draftTitle),
      label: '제목 초안',
      missingText: '제목 필요',
      readyText: '작성됨',
      title: '내 채널에 맞게 바꿀 제목 초안입니다. 아래 Cloud 저장 버튼을 눌러야 저장됩니다.',
    },
    {
      key: 'note',
      isReady: hasText(safeRecord.note),
      label: '제작 메모',
      missingText: '메모 필요',
      readyText: '작성됨',
      title: '훅 포인트, 참고 장면, 만들 방향 메모입니다. 아래 Cloud 저장 버튼을 눌러야 저장됩니다.',
    },
    {
      key: 'publish-date',
      isReady: hasText(safeRecord.targetPublishDate),
      label: '업로드 예정일',
      missingText: '일정 미정',
      readyText: '지정됨',
      title: '업로드 예정일입니다. 아래 Cloud 저장 버튼을 눌러야 저장됩니다.',
    },
  ];
  const readyCount = items.filter((item) => item.isReady).length;

  return {
    description: '제작 시작 전 채워두면 좋은 항목입니다. 상태 확인만 하며 저장이나 API 호출은 실행하지 않습니다.',
    items,
    readyCount,
    summaryText: `${readyCount}/${items.length} 준비`,
    title: '작업 준비 체크',
    tone: readyCount === items.length ? 'ready' : 'working',
    totalCount: items.length,
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
  columnId,
  record,
  video,
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
  workPacketCopyButtonProps: {
    url: getProductionWorkPacketText({
      columnId,
      record,
      video,
      videoUrl,
    }),
    label: '작업 묶음 복사',
    copiedLabel: '묶음 복사 완료',
    ariaLabel: `${videoTitle} 제작 작업 묶음 복사`,
    title: '현재 카드의 원본, 제목 초안, 메모, 일정 정보를 클립보드에 복사합니다. Cloud 저장이나 YouTube API 호출은 없습니다.',
  },
});

const getProductionColumnLabel = (columnId) => (
  columnId === PRODUCTION_FOCUS_COLUMN_ID
    ? '오늘 집중'
    : PRODUCTION_STATUS_LABELS[columnId] || '제작 후보'
);

const getWorkPacketValue = (value, fallback = '미작성') => {
  const text = String(value || '').trim();
  return text || fallback;
};

export const getProductionWorkPacketText = ({
  columnId,
  record = {},
  video = {},
  videoUrl,
} = {}) => {
  const sourceTitle = getWorkPacketValue(video.title, '제목 없는 영상');
  const channelTitle = getWorkPacketValue(video.channel_title || video.channelTitle, '채널 정보 없음');
  const multiplier = video.multiplier !== undefined
    ? `${Number(video.multiplier || 0).toFixed(1)}x`
    : '정보 없음';
  const readiness = getProductionVideoReadinessChecklist({ record, video });

  return [
    '[Creator OS 제작 작업 묶음]',
    `진행 단계: ${getProductionColumnLabel(columnId)}`,
    `원본 제목: ${sourceTitle}`,
    `내가 만들 제목: ${getWorkPacketValue(record.draftTitle)}`,
    `채널: ${channelTitle}`,
    `원본 URL: ${getWorkPacketValue(videoUrl || getYouTubeVideoUrl(video.videoId), '원본 URL 없음')}`,
    `대박 지수: ${multiplier}`,
    `업로드 예정일: ${getWorkPacketValue(record.targetPublishDate, '미정')}`,
    `준비 상태: ${readiness.summaryText}`,
    '',
    '[제작 메모]',
    getWorkPacketValue(record.note),
  ].join('\n');
};

export const getProductionVideoMetaBadgesViewProps = ({ video = {} } = {}) => ({
  channelLabel: video.channel_title || video.channelTitle || '채널 정보 없음',
  multiplierLabel: video.multiplier !== undefined
    ? `대박 지수 ${Number(video.multiplier || 0).toFixed(1)}x`
    : '',
});
