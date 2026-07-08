import { getProductionDiscoveryLinkEditButtonProps } from '../utils/productionDiscoveryLinkActionProps';

export default function ProductionDiscoveryLinkEditButton({
  disabled,
  linkTitle,
  onClick,
}) {
  const buttonProps = getProductionDiscoveryLinkEditButtonProps({ linkTitle });

  return (
    <button
      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-extrabold text-slate-700 transition hover:bg-slate-50"
      aria-label={buttonProps['aria-label']}
      disabled={disabled}
      onClick={onClick}
      title={buttonProps.title}
      type="button"
    >
      {buttonProps.label}
    </button>
  );
}
