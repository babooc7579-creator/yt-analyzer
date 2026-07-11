import { Rocket } from 'lucide-react';

import HomeCandidateWorkflowActions from './HomeCandidateWorkflowActions';
import HomeCandidateWorkflowStatus from './HomeCandidateWorkflowStatus';
import { getHomeCandidateWorkflowCardViewProps } from '../utils/homeCandidateWorkflowActions';

export default function HomeCandidateWorkflowCard({
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  onOpenDiscoveryLinks,
  onOpenProductionCandidates,
  productionCandidateCount,
}) {
  const viewProps = getHomeCandidateWorkflowCardViewProps({
    discoveryCandidateCount,
    discoveryRightsWarningCount,
    productionCandidateCount,
  });

  return (
    <div className={`rounded-2xl border p-4 ${viewProps.hasRightsWarning ? 'border-amber-400/30 bg-amber-500/10' : 'border-emerald-400/20 bg-emerald-500/10'}`}>
      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm font-extrabold ${viewProps.hasRightsWarning ? 'text-amber-100' : 'text-emerald-100'}`}>{viewProps.titleText}</p>
        <Rocket className={`h-4 w-4 ${viewProps.hasRightsWarning ? 'text-amber-200' : 'text-emerald-200'}`} />
      </div>
      <HomeCandidateWorkflowStatus
        discoveryCandidateCount={discoveryCandidateCount}
        discoveryRightsWarningCount={discoveryRightsWarningCount}
        hasRightsWarning={viewProps.hasRightsWarning}
        productionCandidateCount={productionCandidateCount}
      />
      <HomeCandidateWorkflowActions
        hasCandidates={viewProps.hasCandidates}
        hasRightsWarning={viewProps.hasRightsWarning}
        onOpenDiscoveryLinks={onOpenDiscoveryLinks}
        onOpenProductionCandidates={onOpenProductionCandidates}
      />
    </div>
  );
}
