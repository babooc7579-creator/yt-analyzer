import { Rocket } from 'lucide-react';

import { getDiscoveryLinkCandidateActionProps } from '../utils/discoveryLinkActionProps';

export default function DiscoveryLinkCandidateAction({
  currentStatus,
  onSendToCandidate,
  saving,
  title,
}) {
  const {
    buttonProps,
    label,
  } = getDiscoveryLinkCandidateActionProps({
    currentStatus,
    onSendToCandidate,
    saving,
    title,
  });

  return (
    <button {...buttonProps}>
      <Rocket className="h-4 w-4" />
      {label}
    </button>
  );
}
