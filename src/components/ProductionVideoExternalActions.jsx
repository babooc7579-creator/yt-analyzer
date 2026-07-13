import { ExternalLink, Play } from 'lucide-react';

import { getProductionVideoExternalActionsViewProps } from '../utils/productionVideoCard';
import CopyUrlButton from './CopyUrlButton';

export default function ProductionVideoExternalActions({
  columnId,
  record,
  video,
  videoTitle,
  videoUrl,
}) {
  const {
    copyUrlButtonProps,
    openButtonLabel,
    openButtonProps,
    workPacketCopyButtonProps,
  } = getProductionVideoExternalActionsViewProps({
    columnId,
    record,
    video,
    videoTitle,
    videoUrl,
  });

  return (
    <>
      <CopyUrlButton
        {...copyUrlButtonProps}
        className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-extrabold text-slate-600 transition-colors hover:bg-slate-50 disabled:text-slate-300"
      />
      <CopyUrlButton
        {...workPacketCopyButtonProps}
        className="inline-flex items-center justify-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-[11px] font-extrabold text-indigo-700 transition-colors hover:bg-indigo-100 disabled:text-slate-300"
      />
      <a
        href={videoUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-extrabold text-slate-600 hover:bg-slate-50"
        {...openButtonProps}
      >
        <Play className="h-3.5 w-3.5" /> {openButtonLabel} <ExternalLink className="h-3 w-3" />
      </a>
    </>
  );
}
