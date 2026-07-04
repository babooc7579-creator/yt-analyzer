export default function ProductionDiscoveryLinkMoveButton({
  ariaLabel,
  disabled,
  isMoving,
  label,
  movingLabel = '저장 중...',
  onClick,
  title,
  tone = 'indigo',
}) {
  const toneClassName =
    tone === 'danger'
      ? 'border-red-100 bg-red-50 text-red-600 hover:bg-red-100'
      : 'border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100';

  return (
    <button
      className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border px-3 text-[11px] font-extrabold transition disabled:opacity-50 ${toneClassName}`}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      title={title}
      type="button"
    >
      {isMoving ? movingLabel : label}
    </button>
  );
}
