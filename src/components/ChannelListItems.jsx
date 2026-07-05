import ChannelListItem from './ChannelListItem';

const toArray = (items) => (Array.isArray(items) ? items : []);

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
  const selectedChannels = toArray(selectedChannelIds);
  const channelList = toArray(visibleChannels);

  return channelList.map((channel) => {
    const itemProps = {
      channel,
      isSelected: selectedChannels.includes(channel.id),
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
