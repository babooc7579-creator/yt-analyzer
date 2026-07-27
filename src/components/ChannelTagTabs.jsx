import ChannelTagTabRow from './ChannelTagTabRow';
import { getChannelTagScanNoticeProps } from '../utils/channelTagScanProps';

const toArray = (items) => (Array.isArray(items) ? items : []);

const hasChannelTag = (channel, tag) => (
  Array.isArray(channel?.tags) && channel.tags.includes(tag)
);

export default function ChannelTagTabs({
  categories,
  channels,
  selectedCategory,
  getScannableChannelCount,
  scanningTag,
  isScanning,
  onSelectCategory,
  onScanTag,
  showScanActions = true,
}) {
  const categoryList = toArray(categories);
  const channelList = toArray(channels);
  const scanNoticeProps = getChannelTagScanNoticeProps();

  return (
    <>
      <div className="space-y-1">
        {categoryList.map((category) => {
          const count = channelList.filter((channel) => hasChannelTag(channel, category)).length;
          const scannableCount = getScannableChannelCount(category);
          const isActive = selectedCategory === category;

          return (
            <ChannelTagTabRow
              key={category}
              category={category}
              count={count}
              isActive={isActive}
              isScanning={isScanning}
              isScanningTag={scanningTag === category}
              onScanTag={onScanTag}
              onSelectCategory={onSelectCategory}
              scannableCount={scannableCount}
              showScanAction={showScanActions}
            />
          );
        })}
      </div>
      {showScanActions ? (
        <div className="mt-2 bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">
          <p className="text-[11px] font-bold text-emerald-700">{scanNoticeProps.title}</p>
          <p className="text-[10px] text-slate-600 mt-0.5">{scanNoticeProps.description}</p>
        </div>
      ) : null}
    </>
  );
}
