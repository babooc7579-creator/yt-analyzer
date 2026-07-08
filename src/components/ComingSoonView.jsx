import { ArrowLeft, Settings } from 'lucide-react';
import { getComingSoonViewProps } from '../utils/routesProps';

export default function ComingSoonView({ item, onOpenHome }) {
  const {
    backButtonAriaLabel,
    backButtonLabel,
    backButtonTitle,
    noticeText,
    title,
  } = getComingSoonViewProps({ item });

  return (
    <div data-testid="creator-route-coming-soon" className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/90 p-10 text-center shadow-xl shadow-slate-950/30">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
        <Settings className="h-8 w-8 text-slate-400" />
      </div>
      <p className="mt-5 text-sm font-extrabold text-indigo-300">{item?.sectionTitle}</p>
      <h3 className="mt-2 text-2xl font-extrabold text-white">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">{item?.summary}</p>
      <p className="mx-auto mt-4 max-w-xl rounded-xl border border-amber-400/20 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-100">{noticeText}</p>
      {onOpenHome ? (
        <button
          type="button"
          onClick={onOpenHome}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-slate-900 transition hover:bg-slate-100"
          title={backButtonTitle}
          aria-label={backButtonAriaLabel}
        >
          <ArrowLeft className="h-4 w-4" />
          {backButtonLabel}
        </button>
      ) : null}
    </div>
  );
}
