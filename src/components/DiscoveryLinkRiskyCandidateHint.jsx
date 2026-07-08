import { AlertTriangle } from 'lucide-react';

import { getDiscoveryLinkRiskyCandidateHintViewProps } from '../utils/discoveryLinksCopy';

export default function DiscoveryLinkRiskyCandidateHint({ show }) {
  if (!show) return null;

  const { description, title } = getDiscoveryLinkRiskyCandidateHintViewProps();

  return (
    <div className="flex gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs leading-relaxed text-red-100">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p className="font-extrabold">{title}</p>
        <p className="mt-1">
          {description}
        </p>
      </div>
    </div>
  );
}
