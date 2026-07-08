import { ExternalLink, Play } from 'lucide-react';

import CopyUrlButton from './CopyUrlButton';
import { getRadarCandidatePrimaryActionsViewProps } from '../utils/radarCandidates';

export default function RadarCandidatePrimaryActions({ videoTitle, videoUrl }) {
  const viewProps = getRadarCandidatePrimaryActionsViewProps({ videoTitle, videoUrl });

  return (
    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
      <a
        href={viewProps.videoUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-extrabold text-slate-900 hover:bg-rose-50"
        title={viewProps.openButtonProps.title}
        aria-label={viewProps.openButtonProps['aria-label']}
      >
        <Play className="h-4 w-4" /> {viewProps.openButtonProps.label} <ExternalLink className="h-3 w-3" />
      </a>
      <CopyUrlButton
        url={viewProps.videoUrl}
        label={viewProps.copyButtonProps.label}
        copiedLabel={viewProps.copyButtonProps.copiedLabel}
        ariaLabel={viewProps.copyButtonProps.ariaLabel}
        title={viewProps.copyButtonProps.title}
        className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-extrabold text-white transition hover:bg-white/15 disabled:text-white/40"
        iconClassName="h-3.5 w-3.5"
      />
    </div>
  );
}
