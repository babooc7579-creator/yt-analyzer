export default function ChannelScanSummaryBox({ scanDisplay }) {
  return (
    <div className="mt-2 rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-2">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[10px] font-semibold text-slate-500">최근 수집: {scanDisplay.scannedText}</span>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold ${scanDisplay.statusMeta.className}`}>{scanDisplay.statusMeta.label}</span>
      </div>
      <p className="mt-1 text-[10px] leading-snug text-slate-500 break-words" title={scanDisplay.error || undefined}>
        {scanDisplay.hasSummary
          ? `새 영상 ${scanDisplay.newVideosFound} · 갱신 ${scanDisplay.statsRefreshed}${scanDisplay.coverageRate ? ` · ${scanDisplay.coverageRate}` : ''}${scanDisplay.error ? ` · ${scanDisplay.error}` : ''}`
          : '수집 요약 없음'}
      </p>
    </div>
  );
}
