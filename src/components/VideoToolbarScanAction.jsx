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
    <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-3 2xl:max-w-[520px]">
      <button
        type="button"
        onClick={handleManualScan}
        disabled={isScanDisabled}
        className={`shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm ${isScanDisabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
        title={scanTitle}
        aria-label={scanAriaLabel}
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
