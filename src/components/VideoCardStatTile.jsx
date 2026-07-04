export default function VideoCardStatTile({
  children,
  className = 'border-slate-200 bg-slate-50',
  label,
  labelClassName = 'text-slate-400',
  paddingClassName,
}) {
  return (
    <div className={`${paddingClassName} rounded-lg border ${className}`}>
      <p className={`text-[10px] font-bold ${labelClassName}`}>{label}</p>
      {children}
    </div>
  );
}
