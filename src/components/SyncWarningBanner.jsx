import { useState } from 'react';
import { AlertTriangle, CheckCircle2, LoaderCircle } from 'lucide-react';
import {
  getSyncWarningBannerViewProps,
  getSyncWarningRetryButtonViewProps,
  getSyncWarningRetryResult,
} from '../utils/syncWarningBannerProps';

export default function SyncWarningBanner({ actions, message, messages }) {
  const [pendingActionKey, setPendingActionKey] = useState('');
  const [retryResult, setRetryResult] = useState(null);
  const {
    actions: retryActions,
    helpText,
    isVisible,
    messages: warningMessages,
    title,
  } = getSyncWarningBannerViewProps({ actions, message, messages });

  const handleRetry = async (action) => {
    if (pendingActionKey) return;

    setPendingActionKey(action.key);
    setRetryResult(null);
    try {
      const succeeded = await action.onClick();
      setRetryResult(getSyncWarningRetryResult({ action, succeeded }));
    } catch {
      setRetryResult(getSyncWarningRetryResult({ action, succeeded: false }));
    } finally {
      setPendingActionKey('');
    }
  };

  if (!isVisible && !retryResult?.message) return null;

  if (!isVisible) {
    const ResultIcon = retryResult.succeeded ? CheckCircle2 : AlertTriangle;
    return (
      <div
        role="status"
        aria-live="polite"
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-bold shadow-sm ${
          retryResult.succeeded
            ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-50'
            : 'border-amber-400/40 bg-amber-500/15 text-amber-50'
        }`}
      >
        <ResultIcon className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{retryResult.message}</p>
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" className="flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-amber-50 shadow-sm">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
      <div className="min-w-0">
        <p className="text-xs font-extrabold text-amber-100">{title}</p>
        <div className="mt-1 space-y-1">
          {warningMessages.map((warningMessage) => (
            <p key={warningMessage} className="text-xs font-semibold leading-relaxed text-amber-50">{warningMessage}</p>
          ))}
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-amber-100/80">{helpText}</p>
        {retryActions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {retryActions.map((action) => {
              const buttonViewProps = getSyncWarningRetryButtonViewProps({
                action,
                pendingActionKey,
              });
              const actionResult = retryResult?.actionKey === action.key ? retryResult : null;

              return (
                <div key={action.key} className="flex max-w-sm flex-col items-start gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleRetry(action)}
                    disabled={buttonViewProps.disabled}
                    title={action.title}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200/40 bg-amber-100/10 px-3 py-2 text-xs font-extrabold text-amber-50 transition hover:bg-amber-100/20 disabled:cursor-wait disabled:opacity-60"
                  >
                    {buttonViewProps.isPending && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
                    {buttonViewProps.label}
                  </button>
                  {actionResult?.message && (
                    <p
                      role="status"
                      className={`text-[11px] font-bold leading-relaxed ${
                        actionResult.succeeded ? 'text-emerald-200' : 'text-rose-200'
                      }`}
                    >
                      {actionResult.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {retryResult?.message && !retryActions.some(action => action.key === retryResult.actionKey) && (
          <p
            role="status"
            className={`mt-2 text-[11px] font-bold leading-relaxed ${
              retryResult.succeeded ? 'text-emerald-200' : 'text-rose-200'
            }`}
          >
            {retryResult.message}
          </p>
        )}
      </div>
    </div>
  );
}
