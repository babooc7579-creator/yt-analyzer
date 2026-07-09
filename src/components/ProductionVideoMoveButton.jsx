import { Loader2 } from 'lucide-react';

import { getProductionVideoMoveButtonViewProps } from '../utils/productionVideoStatusProps';

export default function ProductionVideoMoveButton({
  activeClassName,
  ariaLabel,
  baseClassName = 'inline-flex items-center justify-center gap-1',
  disabled = false,
  icon: Icon,
  isMoving,
  label,
  loadingLabel,
  onClick,
  title,
}) {
  const { disabled: buttonDisabled, visibleLabel } = getProductionVideoMoveButtonViewProps({
    disabled,
    isMoving,
    label,
    loadingLabel,
  });

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={buttonDisabled}
      className={`${baseClassName} rounded-lg px-3 py-2 text-[11px] font-extrabold ${buttonDisabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : activeClassName}`}
      title={title}
      aria-label={ariaLabel}
    >
      {Icon ? (
        isMoving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />
      ) : null}
      {visibleLabel}
    </button>
  );
}
