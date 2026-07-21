import { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';

export default function RadarActionSuccessFeedback({
  actionLabel,
  actionTitle,
  message,
  onAction,
  onDismiss,
  title,
}) {
  const feedbackRef = useRef(null);

  useEffect(() => {
    if (message) feedbackRef.current?.focus();
  }, [message]);

  if (!message) return null;

  return (
    <div
      ref={feedbackRef}
      className="mt-4 flex flex-col gap-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 sm:flex-row sm:items-center"
      role="status"
      aria-live="polite"
      tabIndex={-1}
    >
      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-extrabold text-emerald-100">{title}</p>
        <p className="mt-1 text-[11px] font-semibold leading-5 text-emerald-50/80">{message}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {actionLabel && typeof onAction === 'function' ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-emerald-100 px-3 py-2 text-xs font-extrabold text-emerald-950 transition-colors hover:bg-white"
            title={actionTitle}
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
        {typeof onDismiss === 'function' ? (
          <button
            type="button"
            onClick={onDismiss}
            className="flex h-9 w-9 items-center justify-center rounded-md text-emerald-100/70 transition-colors hover:bg-emerald-400/15 hover:text-white"
            title="저장 완료 안내 닫기"
            aria-label="저장 완료 안내 닫기"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
