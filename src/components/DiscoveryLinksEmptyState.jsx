import { DISCOVERY_LINKS_EMPTY_STATE } from '../constants/emptyStates';

export default function DiscoveryLinksEmptyState() {
  const [pasteUrlStep, organizeStep, safetyStep] = DISCOVERY_LINKS_EMPTY_STATE.steps;

  return (
    <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="text-sm font-extrabold text-slate-700">{DISCOVERY_LINKS_EMPTY_STATE.title}</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        {DISCOVERY_LINKS_EMPTY_STATE.description}
      </p>
      <div className="mx-auto mt-5 grid max-w-3xl grid-cols-1 gap-3 text-left md:grid-cols-3">
        <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
          <p className="text-xs font-extrabold text-amber-800">{pasteUrlStep.title}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">{pasteUrlStep.description}</p>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
          <p className="text-xs font-extrabold text-indigo-800">{organizeStep.title}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">{organizeStep.description}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-extrabold text-slate-700">{safetyStep.title}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">{safetyStep.description}</p>
        </div>
      </div>
    </div>
  );
}
