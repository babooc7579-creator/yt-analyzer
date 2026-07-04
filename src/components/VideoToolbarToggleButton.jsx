export default function VideoToolbarToggleButton({
  activeClassName,
  ariaLabel,
  fontClassName = 'font-bold',
  inactiveClassName,
  isActive,
  label,
  onClick,
  title,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      className={`px-3 py-1 text-sm ${fontClassName} rounded-md transition-all ${
        isActive
          ? `bg-white shadow ${activeClassName}`
          : inactiveClassName
      }`}
    >
      {label}
    </button>
  );
}
