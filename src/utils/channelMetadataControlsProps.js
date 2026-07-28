import {
  CHANNEL_GRADE,
  CHANNEL_GRADE_LABELS,
  CHANNEL_STATUS,
  CHANNEL_STATUS_LABELS,
} from '../constants/status';

const SELECT_CLASS_NAME = 'w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400';

export const CHANNEL_GRADE_OPTIONS = Object.values(CHANNEL_GRADE).map((value) => ({
  label: `등급 ${CHANNEL_GRADE_LABELS[value]}`,
  value,
}));

export const CHANNEL_STATUS_OPTIONS = Object.values(CHANNEL_STATUS).map((value) => ({
  label: CHANNEL_STATUS_LABELS[value],
  value,
}));

export const getChannelMetadataControlsViewProps = ({
  channel,
  grade,
  isUpdating,
  onUpdateMetadata,
  status,
}) => ({
  gradeLabelText: '채널 등급',
  gradeSelectProps: {
    'aria-label': `${channel.title} 채널 등급 선택, 중요도 표시`,
    className: SELECT_CLASS_NAME,
    disabled: isUpdating,
    onChange: (event) => onUpdateMetadata(channel, { grade: event.target.value }),
    title: '채널 등급 변경 - 중요도 표시이며 새 영상 수집 주기를 자동으로 바꾸지 않습니다',
    value: grade,
  },
  gradeOptions: CHANNEL_GRADE_OPTIONS,
  statusLabelText: '채널 상태',
  statusSelectProps: {
    'aria-label': `${channel.title} 채널 상태 선택, 활성 채널만 새 영상 수집 대상`,
    className: SELECT_CLASS_NAME,
    disabled: isUpdating,
    onChange: (event) => onUpdateMetadata(channel, { status: event.target.value }),
    title: '채널 상태 변경 - 활성 채널만 새 영상 수집 대상이며 변경 내용은 온라인 저장소(Azure DB)에 저장됩니다',
    value: status,
  },
  statusOptions: CHANNEL_STATUS_OPTIONS,
});
