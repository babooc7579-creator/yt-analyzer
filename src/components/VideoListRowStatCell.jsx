export default function VideoListRowStatCell({
  children,
  className = 'bg-white/80 border-slate-200',
  label,
  labelClassName = 'text-slate-400',
  minWidthClassName = 'min-w-[110px]',
  roundedRight = false,
}) {
  return (
    <td className={`px-4 py-5 text-right ${roundedRight ? 'rounded-r-2xl' : ''}`}>
      <div className={`inline-flex ${minWidthClassName} flex-col rounded-xl border px-3 py-2 shadow-sm ${className}`}>
        <span className={`text-[10px] font-bold ${labelClassName}`}>{label}</span>
        {children}
      </div>
    </td>
  );
}
