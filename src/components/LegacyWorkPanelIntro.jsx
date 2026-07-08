import { CheckCircle2, Sparkles } from 'lucide-react';

import { getLegacyWorkPanelIntroViewProps } from '../utils/legacyWorkPanelIntroProps';

const WORKFLOW_STEP_TITLE_CLASS_NAMES = [
  'text-xs font-bold text-slate-800',
  'text-xs font-bold text-emerald-700',
  'text-xs font-bold text-blue-700',
];

const WORKFLOW_STEP_CARD_CLASS_NAMES = [
  'bg-white border border-indigo-100 rounded-lg p-3',
  'bg-white border border-emerald-100 rounded-lg p-3',
  'bg-white border border-blue-100 rounded-lg p-3',
];

export default function LegacyWorkPanelIntro({ apiKey, onChangeApiKey }) {
  const viewProps = getLegacyWorkPanelIntroViewProps({ apiKey, onChangeApiKey });

  return (
    <>
      <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-indigo-600" /> {viewProps.brandTitle}
      </h1>
      <div className="mb-4 border border-indigo-100 bg-indigo-50/60 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
          <div>
            <p className="text-sm font-extrabold text-slate-900">{viewProps.workflowTitle}</p>
            <p className="text-[11px] text-slate-500">{viewProps.workflowDescription}</p>
          </div>
        </div>
        <div className="grid gap-2">
          {viewProps.workflowSteps.map((step, index) => (
            <div className={WORKFLOW_STEP_CARD_CLASS_NAMES[index]} key={step.title}>
              <p className={WORKFLOW_STEP_TITLE_CLASS_NAMES[index]}>{step.title}</p>
              <p className="text-[11px] text-slate-500 mt-1">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <input
          {...viewProps.apiKeyInputProps}
          className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>
    </>
  );
}
