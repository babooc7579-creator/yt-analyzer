import { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { copyTextToClipboard } from '../utils/clipboard';

export default function CopyUrlButton({
  url,
  label = 'URL 복사',
  copiedLabel = '복사 완료',
  copyingLabel = '복사 중',
  errorLabel = '복사 실패',
  title,
  ariaLabel,
  className = '',
  iconClassName = 'h-3.5 w-3.5',
  showLabel = true,
  disabled = false,
}) {
  const [copyState, setCopyState] = useState('idle');
  const resetTimerRef = useRef(null);
  const isCopying = copyState === 'copying';
  const isCopied = copyState === 'copied';
  const isError = copyState === 'error';
  const buttonLabel = isCopied ? copiedLabel : isCopying ? copyingLabel : isError ? errorLabel : label;
  const buttonTitle = title || `${label} - 클립보드에 복사합니다. API 호출이나 저장 작업은 없습니다.`;

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
