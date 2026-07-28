import { AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';

import { getScrapbookHeaderActionsViewProps } from '../utils/scrapbookHeaderActions';
import CopyUrlButton from './CopyUrlButton';

const PROMPT_BUTTON_ICONS = {
  alert: AlertTriangle,
  check: CheckCircle2,
  lightbulb: Lightbulb,
};

export default function ScrapbookHeaderActions({
  copiedPrompt,
  onCopyPrompt,
  promptCopyError,
  savedVideoCount,
  variant,
  videoUrlList,
}) {
  const {
    copyUrlButtonProps,
    promptButtonLabel,
    promptButtonProps,
    promptHelpText,
    promptIconName,
  } = getScrapbookHeaderActionsViewProps({
    copiedPrompt,
    onCopyPrompt,
    promptCopyError,
    savedVideoCount,
    variant,
    videoUrlList,
  });
  const PromptButtonIcon = PROMPT_BUTTON_ICONS[promptIconName];

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <CopyUrlButton {...copyUrlButtonProps} />
        <button {...promptButtonProps}>
          <PromptButtonIcon className="w-5 h-5" /> {promptButtonLabel}
        </button>
      </div>
      <p className="max-w-[320px] text-right text-[10px] text-slate-500" aria-live="polite">
        {promptHelpText}
      </p>
    </div>
  );
}
