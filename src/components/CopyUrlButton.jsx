import { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { copyTextToClipboard } from '../utils/clipboard';
import { getCopyUrlButtonDefaults } from '../utils/copyUrlButtonProps';

export default function CopyUrlButton({
  url,
  label,
  copiedLabel,
  copyingLabel,
  errorLabel,
  title,
  ariaLabel,
  className = '',
  iconClassName = 'h-3.5 w-3.5',
  showLabel = true,
  disabled = false,
}) {
  const [copyState, setCopyState] = useState('idle');
  const defaults = getCopyUrlButtonDefaults({
    label,
    title,
  });
  const resolvedLabel = label || defaults.label;
  const resolvedCopiedLabel = copiedLabel || defaults.copiedLabel;
  const resolvedCopyingLabel = copyingLabel || defaults.copyingLabel;
  const resolvedErrorLabel = errorLabel || defaults.errorLabel;
  const resetTimerRef = useRef(null);
  const isCopying = copyState === 'copying';
  const isCopied = copyState === 'copied';
  const isError = copyState === 'error';
  const buttonLabel = isCopied ? resolvedCopiedLabel : isCopying ? resolvedCopyingLabel : isError ? resolvedErrorLabel : resolvedLabel;
  const buttonTitle = defaults.title;

  const handleCopy = async () => {
    if (!url || isCopying || disabled) return;

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    setCopyState('copying');
    try {
      await copyTextToClipboard(url);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }

    resetTimerRef.current = window.setTimeout(() => setCopyState('idle'), 1800);
  };

  useEffect(() => () => {
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }
  }, []);

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled || !url || isCopying}
      className={className}
      title={buttonTitle}
      aria-label={ariaLabel || buttonLabel}
      aria-live="polite"
      aria-busy={isCopying}
    >
      {isError ? (
        <AlertCircle className={iconClassName} />
      ) : isCopied ? (
        <CheckCircle2 className={iconClassName} />
      ) : (
        <Copy className={iconClassName} />
      )}
      {showLabel ? buttonLabel : null}
      {ariaLabel ? <span className="sr-only">{buttonLabel}</span> : null}
    </button>
  );
}
