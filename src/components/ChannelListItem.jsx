import { CheckSquare, Square } from 'lucide-react';
import { getChannelListItemViewProps } from '../utils/channelListItemProps';
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
  const {
    actionsProps,
    containerClassName,
    metaProps,
    metadataControlsProps,
    scanSummaryProps,
    selectionButtonProps,
    thumbnailProps,
    titleProps,
  } = getChannelListItemViewProps({
    channel,
    isSelected,
    scanDisplay,
    onToggleSelection,
    onOpenNotes,
    onUpdateMetadata,
    isUpdating,
    onDelete,
  });

  return (
    <div className={containerClassName}>
      <button {...selectionButtonProps}>
        {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-300" />}
      </button>
      <img {...thumbnailProps} />
      <div className="flex-1 min-w-0">
        <p {...titleProps}>{channel.title}</p>
        <ChannelListItemMeta {...metaProps} />
        <ChannelMetadataControls {...metadataControlsProps} />
        <ChannelScanSummaryBox {...scanSummaryProps} />
      </div>
      <ChannelListItemActions {...actionsProps} />
    </div>
  );
}
