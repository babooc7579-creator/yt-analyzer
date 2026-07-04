import ChannelTagTabRow from './ChannelTagTabRow';

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
  return (
    <>
      <div className="space-y-1">
        {categories.map((category) => {
          const count = channels.filter((channel) => channel.tags?.includes(category)).length;
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
