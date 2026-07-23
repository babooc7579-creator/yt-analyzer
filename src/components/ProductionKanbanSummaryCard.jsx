import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ProductionKanbanSummaryCard({
  children,
  label,
  labelClassName,
  onClick,
  selected = false,
  title,
  value,
  valueClassName,
  wrapperClassName,
}) {
  const isButton = typeof onClick === 'function';
  const Component = isButton ? 'button' : 'div';

  return (
    <Component
      {...(isButton ? { onClick, type: 'button' } : {})}
      aria-pressed={isButton ? selected : undefined}
      className={`w-full rounded-xl border px-3 py-3 text-left ${wrapperClassName} ${isButton ? 'transition hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300' : ''} ${selected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
      title={title}
    >
      <p className={`text-[10px] font-extrabold uppercase ${labelClassName}`}>
        {label}
      </p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className={`font-black ${valueClassName}`}>{value}</p>
        {isButton ? (
          selected ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-indigo-600 px-2 py-1 text-[10px] font-extrabold text-white">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              현재 보기
            </span>
          ) : (
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          )
        ) : null}
      </div>
      {children}
    </Component>
  );
}
