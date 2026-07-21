import { VIDEO_STATUS } from '../constants/status';

export const RADAR_STATUS_ACTION_ITEMS = [
  {
    className: 'inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-500/10 px-3 py-2 text-[11px] font-extrabold text-emerald-100 ring-1 ring-emerald-400/20 hover:bg-emerald-500/15',
    iconName: 'reviewed',
    label: '봤음',
    status: VIDEO_STATUS.REVIEWED,
    title: 'Cloud 판단 기록에 봤음으로 저장하고 오늘 레이더에서 숨깁니다.',
  },
  {
    className: 'inline-flex items-center justify-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-[11px] font-extrabold text-slate-200 hover:bg-slate-700',
    iconName: 'later',
    label: '나중에 보기',
    status: VIDEO_STATUS.LEGACY_LATER,
    title: 'Cloud 판단 기록에 나중에 보기로 저장하고 오늘 레이더에서 숨깁니다.',
  },
  {
    className: 'inline-flex items-center justify-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-extrabold text-slate-300 ring-1 ring-slate-700 hover:bg-slate-800',
    iconName: 'excluded',
    label: '후보에서 제외',
    status: VIDEO_STATUS.EXCLUDED,
    title: 'Cloud 판단 기록에 후보 제외로 저장하고 오늘 레이더에서 숨깁니다.',
  },
];

const toVideoObject = (video) => (
  video && typeof video === 'object' ? video : {}
);

const noop = () => {};

const getStatusAriaLabel = ({ label, videoTitle }) => {
  if (label === '봤음') {
    return `${videoTitle} Cloud 판단 기록에 봤음으로 저장`;
  }

  if (label === '후보에서 제외') {
    return `${videoTitle} Cloud 판단 기록에 후보 제외로 저장`;
  }

  return `${videoTitle} Cloud 판단 기록에 ${label}로 저장`;
};

export const getRadarCandidateStatusActionProps = ({
  onMarkVideoStatus,
  saving = false,
  video,
  videoTitle,
}) => {
  const sourceVideo = toVideoObject(video);
  const displayTitle = videoTitle || sourceVideo.title || '이 영상';
  const canMarkStatus = Boolean(sourceVideo.videoId)
    && typeof onMarkVideoStatus === 'function'
    && !saving;

  return RADAR_STATUS_ACTION_ITEMS.map((item) => ({
    ariaLabel: getStatusAriaLabel({
      label: item.label,
      videoTitle: displayTitle,
    }),
    className: item.className,
    disabled: !canMarkStatus,
    iconName: item.iconName,
    label: item.label,
    onClick: canMarkStatus
      ? () => onMarkVideoStatus(sourceVideo.videoId, item.status)
      : noop,
    status: item.status,
    title: saving
      ? '다른 Cloud 기록 저장이 끝날 때까지 기다려 주세요.'
      : canMarkStatus
        ? item.title
        : '저장할 영상 ID가 없어 Cloud 판단 기록을 저장할 수 없습니다.',
  }));
};
