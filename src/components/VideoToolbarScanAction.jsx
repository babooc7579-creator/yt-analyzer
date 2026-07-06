import { Loader2, RefreshCw } from 'lucide-react';

export default function VideoToolbarScanAction({
  handleManualScan,
  isScanning,
  scanTargetCount,
  selectedChannelCount,
}) {
  const hasScanTargets = scanTargetCount > 0;
  const isScanDisabled = isScanning || !hasScanTargets;
  const scanButtonLabel = isScanning
    ? '새 영상 수집 중...'
    : selectedChannelCount > 0
      ? `선택 채널 새 영상 수집 (${scanTargetCount}/${selectedChannelCount}개)`
      : `전체 운영중 채널 새 영상 수집 (${scanTargetCount}개)`;
  const scanTitle = hasScanTargets
    ? 'YouTube API로 운영중 채널의 새 영상 여부를 확인합니다. 저장된 영상 불러오기와 다른 작업입니다.'
    : '새 영상 수집을 실행할 운영중 채널이 없습니다. 채널 상태를 운영중으로 바꾸거나 채널을 먼저 저장해 주세요.';
  const scanDescription = hasScanTargets
    ? selectedChannelCount > 0
      ? '체크한 채널 중 운영중 채널만 YouTube API로 새 영상 여부를 확인합니다. 보류/제외 채널은 수집하지 않습니다.'
      : '선택한 채널이 없으면 전체 운영중 채널만 YouTube API로 확인합니다. 필요한 채널만 수집하려면 먼저 채널을 체크하세요.'
    : '운영중 채널이 0개라 새 영상 수집을 실행하지 않습니다. 저장 영상 불러오기는 별도의 DB 조회 작업입니다.';

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-3 2xl:max-w-[520px]">
      <button
        type="button"
        onClick={handleManualScan}
        disabled={isScanDisabled}
        className={`shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm ${isScanDisabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
        title={scanTitle}
        aria-label={hasScanTargets ? '선택 범위 새 영상 수집, YouTube API 호출' : '새 영상 수집 불가, 운영중 채널 없음'}
      >
        {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
        {scanButtonLabel}
      </button>
      <p className="max-w-[260px] text-[10px] leading-snug text-slate-600">
        {scanDescription}
      </p>
    </div>
  );
}
