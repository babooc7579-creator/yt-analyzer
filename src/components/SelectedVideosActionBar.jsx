import { AlertTriangle, CheckCircle2, Copy } from 'lucide-react';

import { getSelectedVideosActionBarViewProps } from '../utils/selectedVideosActionBarProps';

const PROMPT_BUTTON_ICONS = {
  alert: AlertTriangle,
  check: CheckCircle2,
  copy: Copy,
};

export default function SelectedVideosActionBar({
  selectedCount,
  copiedPrompt,
  promptCopyError,
  onCopyPrompt,
}) {
  const viewProps = getSelectedVideosActionBarViewProps({
    copiedPrompt,
    promptCopyError,
    selectedCount,
  });
  if (!viewProps) return null;

  const PromptButtonIcon = PROMPT_BUTTON_ICONS[viewProps.iconName];

  return (
    <div className="bg-indigo-900 rounded-xl p-4 flex justify-between items-center shadow-lg animate-in slide-in-from-top-4">
      <span className="text-indigo-100 font-medium text-sm"><span className="text-white font-bold text-lg">{selectedCount}</span>개 선택됨</span>
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={onCopyPrompt}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg font-bold shadow-md transition-transform hover:scale-105"
          title={viewProps.buttonProps.title}
          aria-label={viewProps.buttonProps['aria-label']}
          type={viewProps.buttonProps.type}
        >
          <PromptButtonIcon className="w-5 h-5" />
          {viewProps.buttonLabel}
        </button>
        <p className="text-[10px] text-indigo-100" aria-live="polite">
          {viewProps.helpText}
        </p>
      </div>
    </div>
  );
}
