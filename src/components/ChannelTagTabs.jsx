import ChannelTagTabRow from './ChannelTagTabRow';

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
}) {
  const categoryList = toArray(categories);
  const channelList = toArray(channels);

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
            />
          );
        })}
      </div>
      <div className="mt-2 bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">
        <p className="text-[11px] font-bold text-emerald-700">태그별 새 영상 수집</p>
        <p className="text-[10px] text-slate-600 mt-0.5">숫자는 운영중/전체 채널입니다. 새 영상 수집은 운영중 채널만 YouTube API로 확인합니다.</p>
      </div>
    </>
  );
}
