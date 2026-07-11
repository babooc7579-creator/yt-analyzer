import { Home, Search, Star } from 'lucide-react';

import { SCRAPBOOK_EMPTY_STATE } from '../constants/emptyStates';
import { getScrapbookEmptyStateActions } from '../utils/scrapbook';
import EmptyStateActions from './EmptyStateActions';

const ACTION_ICONS = {
  home: Home,
  referenceVault: Search,
};

const ACTION_CLASSES = {
  indigo: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
};

export default function ScrapbookEmptyState({
  onOpenHome,
  onOpenReferenceVault,
}) {
  const [saveChannelStep, loadStoredStep, saveScrapStep] = SCRAPBOOK_EMPTY_STATE.steps;
  const actionButtons = getScrapbookEmptyStateActions({
    onOpenHome,
    onOpenReferenceVault,
  });

  return (
    <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 px-6">
      <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h3 className="text-xl font-extrabold text-slate-700 mb-2">{SCRAPBOOK_EMPTY_STATE.title}</h3>
      <p className="mx-auto max-w-xl text-sm text-slate-500">
        {SCRAPBOOK_EMPTY_STATE.description}
      </p>
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 text-left">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-bold text-slate-700">{saveChannelStep.title}</p>
          <p className="text-xs text-slate-500 mt-2">{saveChannelStep.description}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-bold text-slate-700">{loadStoredStep.title}</p>
          <p className="text-xs text-slate-500 mt-2">{loadStoredStep.description}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-bold text-slate-700">{saveScrapStep.title}</p>
          <p className="text-xs text-slate-500 mt-2">{saveScrapStep.description}</p>
        </div>
      </div>
      <EmptyStateActions
        actions={actionButtons}
        buttonBaseClassName="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors"
        className="mt-5 flex flex-wrap justify-center gap-2"
        fallbackIcon={Search}
        icons={ACTION_ICONS}
        variantClasses={{
          ...ACTION_CLASSES,
          default: ACTION_CLASSES.secondary,
        }}
      />
    </div>
  );
}
