export const getChannelScanSummaryBoxViewProps = (scanDisplay) => ({
  summaryText: scanDisplay.hasSummary
    ? `새 영상 ${scanDisplay.newVideosFound} · 갱신 ${scanDisplay.statsRefreshed}${scanDisplay.coverageRate ? ` · ${scanDisplay.coverageRate}` : ''}${scanDisplay.error ? ` · ${scanDisplay.error}` : ''}`
    : '수집 요약 없음',
  summaryTitle: scanDisplay.error || undefined,
  statusBadgeProps: {
    className: `shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold ${scanDisplay.statusMeta.className}`,
    label: scanDisplay.statusMeta.label,
  },
  scannedText: `최근 수집: ${scanDisplay.scannedText}`,
});
