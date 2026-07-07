import { Link as LinkIcon, Rocket } from 'lucide-react';

import { getHomeCandidateWorkflowActions } from '../utils/homeCandidateWorkflowActions';

export default function HomeCandidateWorkflowActions({
  hasCandidates,
  onOpenDiscoveryLinks,
  onOpenProductionCandidates,
}) {
  const actions = getHomeCandidateWorkflowActions({
    hasCandidates,
    onOpenDiscoveryLinks,
    onOpenProductionCandidates,
  });

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 text-[11px] font-extrabold text-white transition hover:bg-white/15"
        onClick={actions.productionCandidates.onClick}
        title={actions.productionCandidates.title}
        aria-label={actions.productionCandidates.ariaLabel}
        type="button"
      >
        <Rocket className="h-3.5 w-3.5" />
        후보함
      </button>
      <button
        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3 text-[11px] font-extrabold text-white/90 transition hover:bg-white/10"
        onClick={actions.discoveryLinks.onClick}
        title={actions.discoveryLinks.title}
        aria-label={actions.discoveryLinks.ariaLabel}
        type="button"
      >
        <LinkIcon className="h-3.5 w-3.5" />
        발견함
      </button>
    </div>
  );
}
