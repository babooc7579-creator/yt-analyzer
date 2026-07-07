import { Bookmark } from 'lucide-react';

import { REFERENCE_VAULT_EMPTY_STATE } from '../constants/emptyStates';

export default function ReferenceVaultEmptyState() {
  const [saveChannelStep, scanStep, loadStoredStep] = REFERENCE_VAULT_EMPTY_STATE.steps;

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5"><Bookmark className="w-10 h-10 text-indigo-400" /></div>
        <h3 className="text-2xl font-extrabold text-slate-800 mb-2">{REFERENCE_VAULT_EMPTY_STATE.title}</h3>
        <p className="text-sm text-slate-500 mb-6">{REFERENCE_VAULT_EMPTY_STATE.description}</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left">
          <div className="border border-indigo-100 bg-indigo-50/60 rounded-xl p-4">
            <p className="text-sm font-bold text-indigo-800">{saveChannelStep.title}</p>
            <p className="text-xs text-slate-600 mt-2">{saveChannelStep.description}</p>
          </div>
          <div className="border border-emerald-100 bg-emerald-50 rounded-xl p-4">
            <p className="text-sm font-bold text-emerald-800">{scanStep.title}</p>
            <p className="text-xs text-slate-600 mt-2">{scanStep.description}</p>
          </div>
          <div className="border border-blue-100 bg-blue-50 rounded-xl p-4">
            <p className="text-sm font-bold text-blue-800">{loadStoredStep.title}</p>
            <p className="text-xs text-slate-600 mt-2">{loadStoredStep.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
