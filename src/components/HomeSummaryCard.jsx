export default function HomeSummaryCard({
  className = 'border-slate-800 bg-slate-950',
  description,
  descriptionClassName = 'text-slate-400',
  label,
  labelClassName = 'text-slate-500',
  value,
  valueClassName = 'text-3xl',
}) {
  return (
    <div className={`rounded-2xl border p-4 ${className}`} title={description}>
      <p className={`text-[11px] font-bold ${labelClassName}`}>{label}</p>
      <p className={`mt-2 font-extrabold text-white ${valueClassName}`}>{value}</p>
      <p className={`mt-1 text-xs ${descriptionClassName}`}>{description}</p>
    </div>
  );
}
