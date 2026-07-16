import { Loader2, RefreshCw } from 'lucide-react';
import { getVideoToolbarScanActionViewProps } from '../utils/videoToolbarProps';

export default function VideoToolbarScanAction({
  handleManualScan,
  isScanning,
  scanTargetCount,
  selectedChannelCount,
}) {
  const {
    isScanDisabled,
    scanAriaLabel,
    scanButtonLabel,
    scanDescription,
    scanTitle,
  } = getVideoToolbarScanActionViewProps({
    isScanning,
    scanTargetCount,
    selectedChannelCount,
  });

  return (
    <div id="channel-operations-scan" className="scroll-mt-5 flex flex-col items-stretch gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-3 sm:flex-row sm:items-start sm:gap-3 2xl:max-w-[520px]">
      <button
        type="button"
        onClick={handleManualScan}
        disabled={isScanDisabled}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-bold shadow-sm transition-all sm:w-auto sm:shrink-0 ${isScanDisabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
        title={scanTitle}
        aria-label={scanAriaLabel}
      >
        {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
        {scanButtonLabel}
      </button>
      <p className="text-[10px] leading-snug text-slate-600 sm:max-w-[260px]">
        {scanDescription}
      </p>
    </div>
  );
}
