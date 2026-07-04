import ChannelListItem from './ChannelListItem';

export default function ChannelListItems({
  getScanDisplay,
  onDelete,
  onOpenNotes,
  onToggleSelection,
  onUpdateMetadata,
  selectedChannelIds,
  updatingChannelId,
  visibleChannels,
}) {
  return visibleChannels.map((channel) => {
    const itemProps = {
      channel,
      isSelected: selectedChannelIds.includes(channel.id),
      isUpdating: updatingChannelId === channel.id,
      onDelete,
      onOpenNotes,
      onToggleSelection,
      onUpdateMetadata,
      scanDisplay: getScanDisplay(channel),
    };

    return (
      <ChannelListItem key={channel.id} {...itemProps} />
    );
  });
}
