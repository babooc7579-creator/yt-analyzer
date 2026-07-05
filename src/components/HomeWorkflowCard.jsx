export default function HomeWorkflowCard({
  className,
  description,
  descriptionClassName,
  icon: Icon,
  iconClassName,
  actionAriaLabel,
  actionLabel,
  actionTitle,
  onAction,
  title,
  titleClassName,
  value,
}) {
  return (
    <div className={`rounded-2xl border p-4 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm font-extrabold ${titleClassName}`}>{title}</p>
        <Icon className={`h-4 w-4 ${iconClassName}`} />
      </div>
      <p className={`mt-2 text-xs leading-relaxed ${descriptionClassName}`}>{description}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-lg font-black text-white">{value}</p>
        {onAction && actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="rounded-lg bg-white/90 px-3 py-1.5 text-[11px] font-extrabold text-slate-900 hover:bg-white"
            title={actionTitle}
            aria-label={actionAriaLabel || actionTitle || actionLabel}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
