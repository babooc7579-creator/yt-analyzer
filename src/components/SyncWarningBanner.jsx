import { AlertTriangle } from 'lucide-react';
import { getSyncWarningBannerViewProps } from '../utils/syncWarningBannerProps';

export default function SyncWarningBanner({ message, messages }) {
  const {
    helpText,
    isVisible,
    messages: warningMessages,
    title,
  } = getSyncWarningBannerViewProps({ message, messages });

  if (!isVisible) return null;

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
      </div>
    </div>
  );
}
