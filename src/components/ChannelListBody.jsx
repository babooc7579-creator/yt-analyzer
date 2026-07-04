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

  return (
    <ChannelListItems
      getScanDisplay={getScanDisplay}
      onDelete={onDelete}
      onOpenNotes={onOpenNotes}
      onToggleSelection={onToggleSelection}
      onUpdateMetadata={onUpdateMetadata}
      selectedChannelIds={selectedChannelIds}
      updatingChannelId={updatingChannelId}
      visibleChannels={visibleChannels}
    />
  );
}
