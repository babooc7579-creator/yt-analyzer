export default function ProductionKanbanSummaryCard({
  children,
  label,
  labelClassName,
  value,
  valueClassName,
  wrapperClassName,
}) {
  return (
    <div className={`rounded-xl border px-3 py-3 ${wrapperClassName}`}>
      <p className={`text-[10px] font-extrabold uppercase ${labelClassName}`}>
        {label}
      </p>
      <p className={`mt-1 font-black ${valueClassName}`}>{value}</p>
      {children}
    </div>
  );
}
