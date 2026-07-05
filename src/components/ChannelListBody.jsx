import ChannelListEmptyState from './ChannelListEmptyState';
import ChannelListItems from './ChannelListItems';
import ChannelListLoadingState from './ChannelListLoadingState';

const toArray = (items) => (Array.isArray(items) ? items : []);

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
  const visibleChannelList = toArray(visibleChannels);

  if (channelsLoading) {
    return <ChannelListLoadingState />;
  }

  if (visibleChannelList.length === 0) {
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
    visibleChannels: visibleChannelList,
  };

  return (
    <ChannelListItems {...itemsProps} />
  );
}
