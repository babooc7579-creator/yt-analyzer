import { getHomeCandidateWorkflowStatusViewProps } from '../utils/homeCandidateWorkflowActions';

export default function HomeCandidateWorkflowStatus({
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  hasRightsWarning,
  productionCandidateCount,
}) {
  const viewProps = getHomeCandidateWorkflowStatusViewProps({
    discoveryCandidateCount,
    discoveryRightsWarningCount,
    hasRightsWarning,
    productionCandidateCount,
  });

  return (
    <>
      <p className={`mt-2 text-xs leading-relaxed ${hasRightsWarning ? 'text-amber-100/80' : 'text-emerald-100/70'}`}>
        {viewProps.descriptionText}
      </p>
      <p className="mt-3 text-lg font-black text-white">{viewProps.metricText}</p>
    </>
  );
}
