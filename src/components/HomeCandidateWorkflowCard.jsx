import { Rocket } from 'lucide-react';

import HomeCandidateWorkflowActions from './HomeCandidateWorkflowActions';
import HomeCandidateWorkflowStatus from './HomeCandidateWorkflowStatus';

export default function HomeCandidateWorkflowCard({
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  onOpenDiscoveryLinks,
  onOpenProductionCandidates,
  productionCandidateCount,
}) {
  const hasCandidates = productionCandidateCount > 0 || discoveryCandidateCount > 0;
  const hasRightsWarning = discoveryRightsWarningCount > 0;

  return (
    <div className={`rounded-2xl border p-4 ${hasRightsWarning ? 'border-amber-400/30 bg-amber-500/10' : 'border-emerald-400/20 bg-emerald-500/10'}`}>
      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm font-extrabold ${hasRightsWarning ? 'text-amber-100' : 'text-emerald-100'}`}>3. 제작 후보로 넘기기</p>
        <Rocket className={`h-4 w-4 ${hasRightsWarning ? 'text-amber-200' : 'text-emerald-200'}`} />
      </div>
      <HomeCandidateWorkflowStatus
        discoveryCandidateCount={discoveryCandidateCount}
        discoveryRightsWarningCount={discoveryRightsWarningCount}
        hasRightsWarning={hasRightsWarning}
        productionCandidateCount={productionCandidateCount}
      />
      <HomeCandidateWorkflowActions
        hasCandidates={hasCandidates}
        onOpenDiscoveryLinks={onOpenDiscoveryLinks}
        onOpenProductionCandidates={onOpenProductionCandidates}
      />
    </div>
  );
}
