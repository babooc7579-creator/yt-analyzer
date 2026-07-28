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
  onClearSelection,
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
    <div className="bg-indigo-900 rounded-xl p-4 flex flex-col gap-3 shadow-lg animate-in slide-in-from-top-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-indigo-100 font-medium text-sm">
        <span className="text-white font-bold text-lg">{viewProps.selectedCountText}</span>
        {viewProps.selectedSuffixText}
      </span>
      <div className="flex min-w-0 flex-col items-stretch gap-1 sm:items-end">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onClearSelection}
            className="rounded-lg border border-indigo-300/50 px-4 py-2.5 text-sm font-bold text-indigo-50 transition hover:bg-indigo-800"
            title={viewProps.clearButtonProps.title}
            aria-label={viewProps.clearButtonProps['aria-label']}
            type={viewProps.clearButtonProps.type}
          >
            {viewProps.clearButtonLabel}
          </button>
          <button
            onClick={onCopyPrompt}
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 px-5 py-2.5 font-bold text-white shadow-md transition-transform hover:scale-105 hover:from-emerald-500 hover:to-teal-600"
            title={viewProps.buttonProps.title}
            aria-label={viewProps.buttonProps['aria-label']}
            type={viewProps.buttonProps.type}
          >
            <PromptButtonIcon className="w-5 h-5" />
            {viewProps.buttonLabel}
          </button>
        </div>
        <p className="text-[10px] leading-relaxed text-indigo-100 sm:text-right" aria-live="polite">
          {viewProps.helpText}
        </p>
        <p className="text-[10px] leading-relaxed text-indigo-200 sm:text-right">
          검색·정렬·화면 이동 뒤에도 선택은 유지됩니다. 새 수집 영상 목록을 불러오면 초기화됩니다.
        </p>
      </div>
    </div>
  );
}
