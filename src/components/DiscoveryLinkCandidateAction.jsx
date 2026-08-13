import { CheckCircle2, Rocket, TriangleAlert } from 'lucide-react';

import {
  getDiscoveryLinkCandidateActionProps,
  getDiscoveryLinkCandidateFeedbackProps,
  getDiscoveryLinkCandidateOpenActionProps,
} from '../utils/discoveryLinkActionProps';

export default function DiscoveryLinkCandidateAction({
  candidateSaveState,
  currentStatus,
  onOpenProductionCandidate,
  onSendToCandidate,
  saving,
  title,
}) {
  const {
    buttonProps,
    label,
  } = getDiscoveryLinkCandidateActionProps({
    candidateSaveState,
    currentStatus,
    onSendToCandidate,
    saving,
    title,
  });
  const feedback = getDiscoveryLinkCandidateFeedbackProps({
    candidateSaveState,
    onOpenProductionCandidate,
  });
  const openAction = getDiscoveryLinkCandidateOpenActionProps({
    currentStatus,
    onOpenProductionCandidate,
    title,
  });

  return (
    <div className="min-w-0">
      <button {...buttonProps}>
        <Rocket className="h-4 w-4" />
        {label}
      </button>
      {openAction ? (
        <button
          className="mt-2 inline-flex h-8 w-full items-center justify-center rounded-lg border border-indigo-200 bg-white px-3 text-[11px] font-extrabold text-indigo-700 hover:bg-indigo-50"
          {...openAction}
        >
          {openAction.label}
        </button>
      ) : null}
      {feedback ? (
        <div
          className={`mt-2 rounded-lg border px-3 py-2 text-[11px] font-bold leading-relaxed ${feedback.className}`}
          role={feedback.role}
        >
          <p className="flex items-start gap-2">
            {feedback.tone === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            ) : (
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </p>
          {feedback.actionProps ? (
            <button
              type="button"
              className="mt-2 inline-flex h-8 items-center justify-center rounded-lg bg-white px-3 text-[11px] font-extrabold shadow-sm ring-1 ring-current/20"
              {...feedback.actionProps}
            >
              후보함에서 이어서
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
