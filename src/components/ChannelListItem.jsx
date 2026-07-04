import { CheckSquare, Square } from 'lucide-react';
import { getChannelGrade, getChannelStatus } from '../constants/status';
import ChannelListItemActions from './ChannelListItemActions';
import ChannelListItemMeta from './ChannelListItemMeta';
import ChannelMetadataControls from './ChannelMetadataControls';
import ChannelScanSummaryBox from './ChannelScanSummaryBox';

export default function ChannelListItem({
  channel,
  isSelected,
  scanDisplay,
  onToggleSelection,
  onOpenNotes,
  onUpdateMetadata,
  isUpdating,
  onDelete,
}) {
  const grade = getChannelGrade(channel);
  const status = getChannelStatus(channel);
  const selectionLabel = `${channel.title} ${isSelected ? '선택 해제' : '선택'} - 저장 영상 조회와 새 영상 수집 대상에 포함`;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-300'}`}>
      <button
        type="button"
        onClick={() => onToggleSelection(channel.id)}
        className="text-indigo-600 focus:outline-none shrink-0 mt-1"
        aria-label={selectionLabel}
        title={selectionLabel}
      >
        {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-300" />}
      </button>
      <img src={channel.thumbnail} alt="" className="w-9 h-9 rounded-full border border-slate-200 shrink-0 mt-1" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2" title={channel.title}>{channel.title}</p>
        <ChannelListItemMeta channel={channel} grade={grade} status={status} />
        <ChannelMetadataControls
          channel={channel}
          grade={grade}
          isUpdating={isUpdating}
          onUpdateMetadata={onUpdateMetadata}
          status={status}
        />
        <ChannelScanSummaryBox scanDisplay={scanDisplay} />
      </div>
      <ChannelListItemActions channel={channel} onDelete={onDelete} onOpenNotes={onOpenNotes} />
    </div>
  );
}
