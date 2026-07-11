import { Filter, RotateCcw } from 'lucide-react';

import { VIDEO_FILTER_EMPTY_STATE } from '../constants/emptyStates';

const ICONS = {
  'reset-filters': RotateCcw,
};

export default function VideoFilterEmptyState({ actions = [] }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
      <div className="mx-auto max-w-xl text-center bg-white border border-dashed border-slate-200 rounded-2xl p-8 shadow-sm">
        <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-base font-bold text-slate-700">{VIDEO_FILTER_EMPTY_STATE.title}</p>
        <p className="text-sm text-slate-500 mt-2">{VIDEO_FILTER_EMPTY_STATE.description}</p>
        {actions.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {actions.map((action) => {
              const Icon = ICONS[action.iconKey] || Filter;

              return (
                <button
                  key={action.key}
                  type="button"
                  onClick={action.onClick}
                  title={action.title}
                  aria-label={action.ariaLabel}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50"
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
