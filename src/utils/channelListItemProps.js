import { getChannelGrade, getChannelStatus } from '../constants/status';

export const getChannelListItemViewProps = ({
  channel,
  isSelected,
  scanDisplay,
  onToggleSelection,
  onOpenNotes,
  onUpdateMetadata,
  isUpdating,
  onDelete,
}) => {
  const grade = getChannelGrade(channel);
  const status = getChannelStatus(channel);
  const selectionLabel = `${channel.title} ${isSelected ? '선택 해제' : '선택'} - 저장 영상 조회와 새 영상 수집 대상에 포함`;

  return {
    actionsProps: {
      channel,
      onDelete,
      onOpenNotes,
    },
    containerClassName: `flex items-start gap-3 p-3 rounded-xl border transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-300'}`,
    metaProps: {
      channel,
      grade,
      status,
    },
    metadataControlsProps: {
      channel,
      grade,
      isUpdating,
      onUpdateMetadata,
      status,
    },
    scanSummaryProps: {
      scanDisplay,
    },
    selectionButtonProps: {
      className: 'text-indigo-600 focus:outline-none shrink-0 mt-1',
      onClick: () => onToggleSelection(channel.id),
      title: selectionLabel,
      'aria-label': selectionLabel,
      type: 'button',
    },
    thumbnailProps: {
      alt: '',
      className: 'w-9 h-9 rounded-full border border-slate-200 shrink-0 mt-1',
      src: channel.thumbnail,
    },
    titleProps: {
      className: 'text-sm font-semibold text-slate-800 leading-snug line-clamp-2',
      title: channel.title,
    },
  };
};
