export default function RadarCandidateStatusButton({
  ariaLabel,
  className,
  icon: Icon,
  label,
  onClick,
  title,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      title={title}
      aria-label={ariaLabel}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
