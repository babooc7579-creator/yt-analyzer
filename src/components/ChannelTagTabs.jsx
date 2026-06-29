import { FolderOpen, Loader2, RefreshCw } from 'lucide-react';

export default function ChannelTagTabs({
  categories,
  channels,
  selectedCategory,
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
          const isActive = selectedCategory === category;

          return (
            <div key={category} className="flex items-center gap-1">
              <button
                onClick={() => onSelectCategory(category)}
                className={`flex-1 text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <span className="flex items-center gap-2">
                  <FolderOpen className={`w-4 h-4 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
                  {category}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-indigo-500/50 text-indigo-100' : 'bg-slate-200 text-slate-500'}`}>{count}</span>
              </button>
              <button
                onClick={() => onScanTag(category)}
                disabled={isScanning || count === 0}
                title={`'${category}' 태그 채널만 새 영상 여부를 확인합니다`}
                aria-label={`'${category}' 태그만 스캔`}
                className="p-2 text-slate-400 hover:text-emerald-600 disabled:text-slate-200 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                {scanningTag === category ? <Loader2 className="w-4 h-4 animate-spin text-emerald-600" /> : <RefreshCw className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-2 bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">
        <p className="text-[11px] font-bold text-emerald-700">이 태그만 스캔</p>
        <p className="text-[10px] text-slate-600 mt-0.5">태그 옆 새로고침 버튼은 선택한 태그의 채널만 새 영상 여부를 확인합니다. YouTube API 호출이 발생합니다.</p>
      </div>
    </>
  );
}
