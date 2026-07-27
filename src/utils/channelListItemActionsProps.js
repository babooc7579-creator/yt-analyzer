import { getYouTubeChannelUrl } from './urls';

const noop = () => {};

const toChannelObject = (channel) => (
  channel && typeof channel === 'object' ? channel : {}
);

export const getChannelListItemActionsViewProps = ({
  channel,
  onDelete,
  onOpenNotes,
}) => {
  const safeChannel = toChannelObject(channel);
  const channelTitle = safeChannel.title || '이 채널';
  const canDelete = Boolean(safeChannel.id) && typeof onDelete === 'function';
  const canOpenNotes = Boolean(safeChannel.id) && typeof onOpenNotes === 'function';

  return {
    copyUrlButtonProps: {
      ariaLabel: `${channelTitle} YouTube 채널 URL 복사`,
      className: 'inline-flex items-center justify-center p-1 text-slate-400 hover:text-blue-600 transition-colors shrink-0 mt-1 disabled:text-slate-200',
      copiedLabel: '복사됨',
      iconClassName: 'w-4 h-4',
      label: '채널 URL 복사',
      showLabel: false,
      title: 'YouTube 채널 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다.',
      url: getYouTubeChannelUrl(safeChannel),
    },
    deleteButtonProps: {
      className: 'p-1 text-slate-400 hover:text-red-500 transition-colors shrink-0 mt-1 disabled:cursor-not-allowed disabled:text-slate-200 disabled:hover:text-slate-200',
      disabled: !canDelete,
      onClick: canDelete
        ? () => onDelete(safeChannel.id, safeChannel.category, safeChannel.title)
        : noop,
      title: canDelete
        ? 'Cloud 채널 목록에서 삭제합니다. 조회/수집 대상에서 빠지지만 YouTube 원본이나 이미 수집된 영상 정보는 삭제하지 않습니다.'
        : '삭제할 채널 ID가 없어 Cloud 삭제를 실행하지 않습니다.',
      'aria-label': canDelete
        ? `${channelTitle} Cloud 채널 목록에서 삭제하고 조회/수집 대상에서 제외, 수집 영상 정보는 삭제하지 않음`
        : `${channelTitle} 삭제 비활성화 - 채널 ID 없음`,
      type: 'button',
    },
    noteCount: safeChannel.notes?.length || 0,
    notesButtonProps: {
      className: 'relative p-1 text-slate-400 hover:text-indigo-600 transition-colors shrink-0 mt-1 disabled:cursor-not-allowed disabled:text-slate-200 disabled:hover:text-slate-200',
      disabled: !canOpenNotes,
      onClick: canOpenNotes ? () => onOpenNotes(safeChannel) : noop,
      title: canOpenNotes ? '분석/기록 남기기' : '분석/기록을 열 채널 ID가 없습니다.',
      'aria-label': canOpenNotes
        ? `${channelTitle} 분석/기록 남기기`
        : `${channelTitle} 분석/기록 비활성화 - 채널 ID 없음`,
      type: 'button',
    },
  };
};
