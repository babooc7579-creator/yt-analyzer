import { ArrowRight } from 'lucide-react';

export default function ProductionKanbanSummaryCard({
  children,
  label,
  labelClassName,
  onClick,
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
      className={`w-full rounded-xl border px-3 py-3 text-left ${wrapperClassName} ${isButton ? 'transition hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300' : ''}`}
      title={title}
    >
      <p className={`text-[10px] font-extrabold uppercase ${labelClassName}`}>
        {label}
      </p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className={`font-black ${valueClassName}`}>{value}</p>
        {isButton ? <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" /> : null}
      </div>
      {children}
    </Component>
  );
}
