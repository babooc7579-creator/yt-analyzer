import { Bookmark, CheckCircle2, Rocket } from 'lucide-react';

import { getRadarCandidateCompletedStateViewProps } from '../utils/radarCandidateStateProps';
import RadarDecisionPanel from './RadarDecisionPanel';

export default function RadarCandidateCompletedState({
  clearDecisionsPending,
  decisionGroups,
  decisionSummary,
  loadedDecisionCount,
  onClearDecisions,
  onOpenProductionCandidates,
  onOpenVault,
  onRestoreVideo,
}) {
  const {
    clearDecisionsButtonProps,
    descriptionText,
    openProductionButtonProps,
    openVaultButtonProps,
    titleText,
  } = getRadarCandidateCompletedStateViewProps();

  return (
    <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
      <p className="text-sm font-extrabold text-emerald-100">{titleText}</p>
      <p className="mt-2 text-xs leading-relaxed text-emerald-100/70">{descriptionText}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpenVault}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-100 hover:bg-blue-500/15"
          title={openVaultButtonProps.title}
          aria-label={openVaultButtonProps['aria-label']}
        >
          <Bookmark className="h-4 w-4" /> {openVaultButtonProps.label}
        </button>
        {onOpenProductionCandidates && (
          <button
            type="button"
            onClick={onOpenProductionCandidates}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-100 hover:bg-indigo-500/15"
            title={openProductionButtonProps.title}
            aria-label={openProductionButtonProps['aria-label']}
          >
            <Rocket className="h-4 w-4" /> {openProductionButtonProps.label}
          </button>
        )}
        <button
          type="button"
          onClick={onClearDecisions}
          disabled={clearDecisionsPending}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-100 hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-50"
          title={clearDecisionsPending ? 'Cloud 판단 기록 초기화가 끝날 때까지 기다려 주세요.' : clearDecisionsButtonProps.title}
          aria-label={clearDecisionsButtonProps['aria-label']}
        >
          <CheckCircle2 className="h-4 w-4" /> {clearDecisionsPending ? '초기화 중' : clearDecisionsButtonProps.label}
        </button>
      </div>
      <RadarDecisionPanel
        decisionGroups={decisionGroups}
        decisionSummary={decisionSummary}
        loadedDecisionCount={loadedDecisionCount}
        onRestoreVideo={onRestoreVideo}
      />
    </div>
  );
}
