import { X } from 'lucide-react';

import { getChannelPreviewSummaryViewProps } from '../utils/channelAddCopy';

export default function ChannelPreviewSummary({
  cancelChannelPreview,
  channelPreview,
}) {
  const {
    closeButtonProps,
    statusLabel,
  } = getChannelPreviewSummaryViewProps();

  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-indigo-200">
      <img src={channelPreview.thumbnail} alt="" className="w-9 h-9 rounded-full border border-slate-200" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate">{channelPreview.title}</p>
        <p className="text-[10px] text-emerald-600 font-semibold">{statusLabel}</p>
      </div>
      <button
        type="button"
        onClick={cancelChannelPreview}
        className="text-slate-400 hover:text-slate-600"
        title={closeButtonProps.title}
        aria-label={closeButtonProps.ariaLabel}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
