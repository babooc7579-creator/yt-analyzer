import { formatCoverageRate, formatOptionalNumber } from './formatters';

export const formatRelativeTime = (dateValue) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
};

export const getScanStatusMeta = (status) => {
  if (status === 'success') return { label: 'success', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
  if (status === 'partial') return { label: 'partial', className: 'bg-amber-50 text-amber-700 border-amber-100' };
  if (status === 'failed') return { label: 'failed', className: 'bg-red-50 text-red-700 border-red-100' };
  return { label: '미수집', className: 'bg-slate-50 text-slate-500 border-slate-200' };
};

export const getChannelScanDisplay = (channel) => {
  const summary = channel.lastScanSummary || null;
  const scannedAt = summary?.scannedAt || channel.lastScannedAt || null;
  const status = summary?.status || (scannedAt ? 'success' : 'none');
  const coverageRate = formatCoverageRate(summary?.coverageRate);
  const numericCoverageRate = Number(summary?.coverageRate);
  const coverageExceedsChannelTotal = Number.isFinite(numericCoverageRate)
    && numericCoverageRate > 100;

  return {
    statusMeta: getScanStatusMeta(status),
    scannedText: scannedAt ? formatRelativeTime(scannedAt) : '미수집',
    newVideosFound: formatOptionalNumber(summary?.newVideosFound),
    statsRefreshed: formatOptionalNumber(summary?.statsRefreshed),
    coverageRate,
    coverageExceedsChannelTotal,
    hasSummary: Boolean(summary),
    error: summary?.error || null,
  };
};
