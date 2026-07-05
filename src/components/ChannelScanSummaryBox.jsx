import { getChannelScanSummaryBoxViewProps } from '../utils/channelScanSummaryBoxProps';

export default function ChannelScanSummaryBox({ scanDisplay }) {
  const {
    scannedText,
    statusBadgeProps,
    summaryText,
    summaryTitle,
  } = getChannelScanSummaryBoxViewProps(scanDisplay);

  return (
    <div className="mt-2 rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-2">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[10px] font-semibold text-slate-500">{scannedText}</span>
        <span className={statusBadgeProps.className}>{statusBadgeProps.label}</span>
      </div>
      <p className="mt-1 text-[10px] leading-snug text-slate-500 break-words" title={summaryTitle}>
        {summaryText}
      </p>
    </div>
  );
}
