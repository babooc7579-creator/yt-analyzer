import ChannelListEmptyState from './ChannelListEmptyState';
import ChannelListItems from './ChannelListItems';
import ChannelListLoadingState from './ChannelListLoadingState';

export default function ChannelListBody({
  channelsLoading,
  getScanDisplay,
  onDelete,
  onOpenNotes,
  onToggleSelection,
  onUpdateMetadata,
  selectedChannelIds,
  updatingChannelId,
  visibleChannels,
}) {
  if (channelsLoading) {
    return <ChannelListLoadingState />;
  }

  if (visibleChannels.length === 0) {
    return <ChannelListEmptyState />;
  }

  const itemsProps = {
    getScanDisplay,
    onDelete,
    onOpenNotes,
    onToggleSelection,
    onUpdateMetadata,
    selectedChannelIds,
    updatingChannelId,
    visibleChannels,
  };

  return (
    <ChannelListItems {...itemsProps} />
  );
}
