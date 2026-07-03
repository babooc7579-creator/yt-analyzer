import { Loader2, RefreshCw } from 'lucide-react';

export default function VideoToolbarScanAction({
  handleManualScan,
  isScanning,
  scanTargetCount,
  selectedChannelCount,
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-3 2xl:max-w-[520px]">
      <button
        type="button"
        onClick={handleManualScan}
        disabled={isScanning}
        className={`shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm ${isScanning ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
        title="YouTube API로 운영중 채널의 새 영상 여부를 확인합니다. 저장된 영상 불러오기와 다른 작업입니다."
        aria-label="선택 범위 새 영상 수집, YouTube API 호출"
      >
        {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
        {isScanning ? '새 영상 수집 중...' : selectedChannelCount > 0 ? `선택 채널 새 영상 수집 (${scanTargetCount}/${selectedChannelCount}개)` : `전체 운영중 채널 새 영상 수집 (${scanTargetCount}개)`}
      </button>
      <p className="max-w-[260px] text-[10px] leading-snug text-slate-600">
        {selectedChannelCount > 0
          ? '체크한 채널 중 운영중 채널만 YouTube API로 새 영상 여부를 확인합니다. 보류/제외 채널은 수집하지 않습니다.'
          : '선택한 채널이 없으면 전체 운영중 채널만 YouTube API로 확인합니다. 필요한 채널만 수집하려면 먼저 채널을 체크하세요.'}
      </p>
    </div>
  );
}
