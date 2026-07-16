import {
  getChannelList,
  getChannelListBodyProps,
  getChannelListExportPanelProps,
  getVisibleChannelUrlList,
  getVisibleChannels,
} from '../utils/channelListProps';
import ChannelListBody from './ChannelListBody';
import ChannelListUrlExportPanel from './ChannelListUrlExportPanel';

export default function ChannelList({
  channels,
  selectedCategory,
  selectedChannelIds,
  channelsLoading,
  getScanDisplay,
  onToggleSelection,
  onOpenNotes,
  onUpdateMetadata,
  updatingChannelId,
  onDelete,
}) {
  const channelList = getChannelList(channels);
  const visibleChannels = getVisibleChannels(channelList, selectedCategory);
  const visibleChannelUrlList = getVisibleChannelUrlList(visibleChannels);

  const exportPanelProps = getChannelListExportPanelProps({
    selectedCategory,
    visibleChannelUrlList,
    visibleChannels,
  });

  const bodyProps = getChannelListBodyProps({
    channelList,
    channelsLoading,
    getScanDisplay,
    onDelete,
    onOpenNotes,
    onToggleSelection,
    onUpdateMetadata,
    selectedChannelIds,
    selectedCategory,
    updatingChannelId,
    visibleChannels,
  });

  return (
    <div id="channel-operations-manage" className="scroll-mt-5 space-y-3">
      {!channelsLoading && visibleChannels.length > 0 ? (
        <ChannelListUrlExportPanel {...exportPanelProps} />
      ) : null}

      <div className="space-y-3 max-h-[420px] xl:max-h-[520px] overflow-y-auto pr-1.5">
        <ChannelListBody {...bodyProps} />
      </div>
    </div>
  );
}
