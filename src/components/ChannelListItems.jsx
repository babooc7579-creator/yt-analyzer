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
  return visibleChannels.map((channel) => (
    <ChannelListItem
      key={channel.id}
      channel={channel}
      isSelected={selectedChannelIds.includes(channel.id)}
      scanDisplay={getScanDisplay(channel)}
      onToggleSelection={onToggleSelection}
      onOpenNotes={onOpenNotes}
      onUpdateMetadata={onUpdateMetadata}
      isUpdating={updatingChannelId === channel.id}
      onDelete={onDelete}
    />
  ));
}
