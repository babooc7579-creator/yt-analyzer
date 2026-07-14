import { Bookmark, CheckCircle2, ListChecks, Plus, RefreshCw, Rocket, ShieldAlert } from 'lucide-react';

import { getHomeNextAction, getHomeNextActionPanelViewProps } from '../utils/homeNextAction';

const TONE_STYLES = {
  amber: {
    border: 'border-amber-400/25 bg-amber-500/10',
    icon: 'bg-amber-400/15 text-amber-200',
    eyebrow: 'text-amber-200',
    badge: 'bg-amber-400/15 text-amber-100',
    button: 'bg-amber-200 text-amber-950 hover:bg-amber-100',
  },
  blue: {
    border: 'border-blue-400/25 bg-blue-500/10',
    icon: 'bg-blue-400/15 text-blue-200',
    eyebrow: 'text-blue-200',
    badge: 'bg-blue-400/15 text-blue-100',
    button: 'bg-blue-100 text-blue-950 hover:bg-white',
  },
  emerald: {
    border: 'border-emerald-400/25 bg-emerald-500/10',
    icon: 'bg-emerald-400/15 text-emerald-200',
    eyebrow: 'text-emerald-200',
    badge: 'bg-emerald-400/15 text-emerald-100',
    button: 'bg-emerald-100 text-emerald-950 hover:bg-white',
  },
  indigo: {
    border: 'border-indigo-400/25 bg-indigo-500/10',
    icon: 'bg-indigo-400/15 text-indigo-200',
    eyebrow: 'text-indigo-200',
    badge: 'bg-indigo-400/15 text-indigo-100',
    button: 'bg-indigo-100 text-indigo-950 hover:bg-white',
  },
  rose: {
    border: 'border-rose-400/25 bg-rose-500/10',
    icon: 'bg-rose-400/15 text-rose-200',
    eyebrow: 'text-rose-200',
    badge: 'bg-rose-400/15 text-rose-100',
    button: 'bg-rose-100 text-rose-950 hover:bg-white',
  },
};

const NEXT_ACTION_ICONS = {
  bookmark: Bookmark,
  checkCircle: CheckCircle2,
  listChecks: ListChecks,
  plus: Plus,
  refresh: RefreshCw,
  rocket: Rocket,
  shieldAlert: ShieldAlert,
};

export default function HomeNextActionPanel(props) {
  const nextAction = getHomeNextAction(props);
  const panelProps = getHomeNextActionPanelViewProps();
  const styles = TONE_STYLES[nextAction.tone] || TONE_STYLES.indigo;
  const Icon = NEXT_ACTION_ICONS[nextAction.iconKey] || Plus;

  return (
    <div className={`mt-4 rounded-2xl border p-4 ${styles.border}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className={`text-[11px] font-extrabold ${styles.eyebrow}`}>{panelProps.eyebrow}</p>
              <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${styles.badge}`}>
                {nextAction.badge}
              </span>
            </div>
            <h4 className="mt-1 text-base font-black text-white">{nextAction.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">{nextAction.description}</p>
            {nextAction.impactText && (
              <p className="mt-2 text-[11px] font-bold leading-relaxed text-slate-400">
                {nextAction.impactText}
              </p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
          <p className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-xs font-black text-white">
            {nextAction.metric}
          </p>
          {nextAction.onAction && nextAction.actionLabel && (
            <button
              type="button"
              onClick={nextAction.onAction}
              className={`rounded-xl px-3 py-2 text-xs font-extrabold transition ${styles.button}`}
              title={nextAction.actionTitle}
              aria-label={nextAction.actionTitle || nextAction.actionLabel}
            >
              {nextAction.actionLabel}
            </button>
          )}
          {nextAction.secondaryActions?.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onAction}
              className="rounded-xl border border-white/15 bg-slate-950/50 px-3 py-2 text-xs font-extrabold text-slate-200 transition hover:border-white/30 hover:text-white"
              title={action.title}
              aria-label={action.title || action.label}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
