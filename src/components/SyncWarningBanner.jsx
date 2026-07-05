import { AlertTriangle } from 'lucide-react';
import { SYNC_WARNING_BANNER_COPY } from '../constants/syncWarnings';

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function SyncWarningBanner({ message, messages }) {
  const messageList = toArray(messages);
  const warningMessages = messageList.length > 0 ? messageList : (message ? [message] : []);

  if (warningMessages.length === 0) return null;

  return (
    <div role="status" aria-live="polite" className="flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-amber-50 shadow-sm">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
      <div className="min-w-0">
        <p className="text-xs font-extrabold text-amber-100">{SYNC_WARNING_BANNER_COPY.title}</p>
        <div className="mt-1 space-y-1">
          {warningMessages.map((warningMessage) => (
            <p key={warningMessage} className="text-xs font-semibold leading-relaxed text-amber-50">{warningMessage}</p>
          ))}
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-amber-100/80">{SYNC_WARNING_BANNER_COPY.helpText}</p>
      </div>
    </div>
  );
}
