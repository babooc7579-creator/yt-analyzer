export default function EmptyStateActions({
  actions = [],
  buttonBaseClassName = '',
  className = 'mt-6 flex flex-wrap justify-center gap-3',
  fallbackIcon: FallbackIcon,
  icons = {},
  variantClasses = {},
}) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {actions.map((action) => {
        const Icon = icons[action.iconKey] || FallbackIcon;
        const variantClassName = variantClasses[action.variant] || variantClasses.default || '';
        const buttonClassName = `${buttonBaseClassName} ${variantClassName}`.trim();

        return (
          <button
            key={action.key}
            type="button"
            onClick={action.onClick}
            title={action.title}
            aria-label={action.ariaLabel}
            className={buttonClassName}
          >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
