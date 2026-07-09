export default function RadarCandidateStatusButton({
  ariaLabel,
  className,
  disabled = false,
  icon: Icon,
  label,
  onClick,
  title,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      title={title}
      aria-label={ariaLabel}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
