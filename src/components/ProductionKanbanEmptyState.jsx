import { Home, Link as LinkIcon, Rocket, Star } from 'lucide-react';

import { PRODUCTION_KANBAN_EMPTY_STATE } from '../constants/emptyStates';
import { getProductionKanbanEmptyStateActions } from '../utils/productionKanbanProps';

const ACTION_ICONS = {
  discoveryLinks: LinkIcon,
  home: Home,
  referenceVault: Rocket,
};

const ACTION_CLASSES = {
  indigo: 'bg-indigo-600 text-white hover:bg-indigo-700',
  rose: 'bg-rose-600 text-white hover:bg-rose-700',
  secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
};

export default function ProductionKanbanEmptyState({
  onOpenDiscoveryLinks,
  onOpenHome,
  onOpenReferenceVault,
}) {
  const [radarStep, storedVideoStep, discoveryStep] = PRODUCTION_KANBAN_EMPTY_STATE.steps;
  const actionButtons = getProductionKanbanEmptyStateActions({
    onOpenDiscoveryLinks,
    onOpenHome,
    onOpenReferenceVault,
  });

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <Star className="mx-auto h-12 w-12 text-slate-300" />
      <h3 className="mt-4 text-lg font-extrabold text-slate-800">{PRODUCTION_KANBAN_EMPTY_STATE.title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
        {PRODUCTION_KANBAN_EMPTY_STATE.description}
      </p>
      <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-3 text-left md:grid-cols-3">
        <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-4">
          <p className="text-sm font-extrabold text-rose-800">{radarStep.title}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            {radarStep.description}
          </p>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
          <p className="text-sm font-extrabold text-indigo-800">{storedVideoStep.title}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            {storedVideoStep.description}
          </p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
          <p className="text-sm font-extrabold text-amber-800">{discoveryStep.title}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            {discoveryStep.description}
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {actionButtons.map((action) => {
          const ActionIcon = ACTION_ICONS[action.iconKey] || Rocket;
          const actionClassName = ACTION_CLASSES[action.variant] || ACTION_CLASSES.secondary;

          return (
            <button
              key={action.key}
              type="button"
              onClick={action.onClick}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${actionClassName}`}
              title={action.title}
              aria-label={action.ariaLabel}
            >
              <ActionIcon className="h-4 w-4" /> {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
