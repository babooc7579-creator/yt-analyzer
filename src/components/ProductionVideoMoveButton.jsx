import { Loader2 } from 'lucide-react';

export default function ProductionVideoMoveButton({
  activeClassName,
  ariaLabel,
  baseClassName = 'inline-flex items-center justify-center gap-1',
  icon: Icon,
  isMoving,
  label,
  loadingLabel = '이동 중...',
  onClick,
  title,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isMoving}
      className={`${baseClassName} rounded-lg px-3 py-2 text-[11px] font-extrabold ${isMoving ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : activeClassName}`}
      title={title}
      aria-label={ariaLabel}
    >
      {Icon ? (
        isMoving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />
      ) : null}
      {isMoving ? loadingLabel : label}
    </button>
  );
}
