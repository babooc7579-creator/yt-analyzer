import { FolderOpen, Loader2, RefreshCw } from 'lucide-react';

export default function ChannelTagTabRow({
  category,
  count,
  isActive,
  isScanning,
  isScanningTag,
  onScanTag,
  onSelectCategory,
  scannableCount,
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onSelectCategory(category)}
        title={`'${category}' 태그 채널 목록 보기 - 운영중 ${scannableCount}개 / 전체 ${count}개`}
        aria-label={`'${category}' 태그 채널 목록 보기`}
        className={`flex-1 text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        <span className="flex items-center gap-2">
          <FolderOpen className={`w-4 h-4 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
          {category}
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-indigo-500/50 text-indigo-100' : 'bg-slate-200 text-slate-500'}`}>
          {scannableCount}/{count}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onScanTag(category)}
        disabled={isScanning || scannableCount === 0}
        title={`'${category}' 태그의 운영중 채널 ${scannableCount}개만 새 영상 수집합니다. YouTube API 호출이 발생하며 저장 영상 불러오기와 다른 작업입니다.`}
        aria-label={`'${category}' 태그 새 영상 수집, YouTube API 호출`}
        className="p-2 text-slate-400 hover:text-emerald-600 disabled:text-slate-200 disabled:cursor-not-allowed transition-colors shrink-0"
      >
        {isScanningTag ? <Loader2 className="w-4 h-4 animate-spin text-emerald-600" /> : <RefreshCw className="w-4 h-4" />}
      </button>
    </div>
  );
}
