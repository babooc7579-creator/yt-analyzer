const COVERAGE_HISTORY_NOTE = '이전 영상 이력 포함';
const COVERAGE_HISTORY_HELP = '보관된 과거·삭제·비공개 영상 이력이 현재 YouTube 채널의 공개 영상 수보다 많아 100%로 표시합니다.';

export const getChannelScanSummaryBoxViewProps = (scanDisplay) => {
  const coverageHistoryNote = scanDisplay.coverageExceedsChannelTotal
    ? COVERAGE_HISTORY_NOTE
    : '';
  const summaryTitle = [
    scanDisplay.error,
    coverageHistoryNote ? COVERAGE_HISTORY_HELP : '',
  ].filter(Boolean).join(' · ') || undefined;

  return {
    summaryText: scanDisplay.hasSummary
      ? `새 영상 ${scanDisplay.newVideosFound} · 갱신 ${scanDisplay.statsRefreshed}${scanDisplay.coverageRate ? ` · ${scanDisplay.coverageRate}` : ''}${coverageHistoryNote ? ` · ${coverageHistoryNote}` : ''}${scanDisplay.error ? ` · ${scanDisplay.error}` : ''}`
      : '수집 요약 없음',
    summaryTitle,
    statusBadgeProps: {
      className: `shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold ${scanDisplay.statusMeta.className}`,
      label: scanDisplay.statusMeta.label,
    },
    scannedText: `최근 수집: ${scanDisplay.scannedText}`,
  };
};
