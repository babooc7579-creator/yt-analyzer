import { getYouTubeChannelUrl } from './urls';

export const getChannelListItemActionsViewProps = ({
  channel,
  onDelete,
  onOpenNotes,
}) => ({
  copyUrlButtonProps: {
    ariaLabel: `${channel.title} YouTube 채널 URL 복사`,
    className: 'inline-flex items-center justify-center p-1 text-slate-400 hover:text-blue-600 transition-colors shrink-0 mt-1 disabled:text-slate-200',
    copiedLabel: '복사됨',
    iconClassName: 'w-4 h-4',
    label: '채널 URL 복사',
    showLabel: false,
    title: 'YouTube 채널 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다.',
    url: getYouTubeChannelUrl(channel),
  },
  deleteButtonProps: {
    className: 'p-1 text-slate-400 hover:text-red-500 transition-colors shrink-0 mt-1',
    onClick: () => onDelete(channel.id, channel.category, channel.title),
    title: 'Cloud 채널 목록에서 삭제합니다. 저장 영상 조회와 새 영상 수집 대상에서 빠집니다.',
    'aria-label': `${channel.title} Cloud 채널 목록에서 삭제하고 조회/수집 대상에서 제외`,
    type: 'button',
  },
  noteCount: channel.notes?.length || 0,
  notesButtonProps: {
    className: 'relative p-1 text-slate-400 hover:text-indigo-600 transition-colors shrink-0 mt-1',
    onClick: () => onOpenNotes(channel),
    title: '분석/기록 남기기',
    'aria-label': `${channel.title} 분석/기록 남기기`,
    type: 'button',
  },
});
