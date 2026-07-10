export default function HomeActionShortcutButton({
  title,
  description,
  dataFlowLabels = [],
  hint,
  icon: Icon,
  onClick,
  className,
  titleClassName,
  hintClassName,
  iconClassName,
  iconHoverClassName,
}) {
  const labels = Array.isArray(dataFlowLabels) ? dataFlowLabels.filter(Boolean) : [];

  return (
    <button
      onClick={onClick}
      className={`group rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${className}`}
      title={`${title} - ${description} ${hint}`}
      aria-label={`${title}: ${description}`}
      type="button"
    >
      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm font-extrabold ${titleClassName}`}>{title}</p>
        <Icon className={`h-4 w-4 transition-transform ${iconClassName} ${iconHoverClassName}`} />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">{description}</p>
      {labels.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {labels.map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-extrabold text-slate-300"
            >
              {label}
            </span>
          ))}
        </div>
      )}
      <p className={`mt-3 text-[10px] font-bold ${hintClassName}`}>{hint}</p>
    </button>
  );
}
