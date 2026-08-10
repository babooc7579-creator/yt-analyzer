import { Loader2, RefreshCw } from 'lucide-react';
import { useRef, useState } from 'react';
import { getVideoToolbarScanActionViewProps } from '../utils/videoToolbarProps';
import VideoToolbarScanResultFeedback from './VideoToolbarScanResultFeedback';

export default function VideoToolbarScanAction({
  handleManualScan,
  isScanning,
  onOpenRecentScanStatus,
  scanTargetCount,
  selectedChannelCount,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanFeedback, setScanFeedback] = useState(null);
  const scanRequestPendingRef = useRef(false);
  const scanPending = isScanning || isSubmitting;
  const {
    isScanDisabled,
    scanAriaLabel,
    scanButtonLabel,
    scanDescription,
    scanTitle,
  } = getVideoToolbarScanActionViewProps({
    isScanning: scanPending,
    scanTargetCount,
    selectedChannelCount,
  });
  const runManualScan = async () => {
    if (scanRequestPendingRef.current || scanPending || typeof handleManualScan !== 'function') return;

    scanRequestPendingRef.current = true;
    setIsSubmitting(true);
    setScanFeedback(null);
    try {
      const result = await handleManualScan();
      if (result?.success && result.feedback) setScanFeedback(result.feedback);
    } finally {
      scanRequestPendingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div id="channel-operations-scan" className="min-w-0 scroll-mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-3">
      <div className="flex flex-col items-stretch gap-2">
        <button
          type="button"
          onClick={runManualScan}
          disabled={isScanDisabled}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-bold shadow-sm transition-all ${isScanDisabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
          title={scanTitle}
          aria-label={scanAriaLabel}
        >
          {scanPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          {scanButtonLabel}
        </button>
        <p className="text-[10px] leading-relaxed text-slate-600">
          {scanDescription}
        </p>
      </div>

      <VideoToolbarScanResultFeedback
        feedback={scanFeedback}
        onOpenRecentScanStatus={onOpenRecentScanStatus}
      />
    </div>
  );
}
