import { ExternalLink } from 'lucide-react';

import { getProductionDiscoveryLinkOpenButtonProps } from '../utils/productionDiscoveryLinkActionProps';

export default function ProductionDiscoveryLinkOpenButton({
  link,
  linkTitle,
}) {
  const buttonProps = getProductionDiscoveryLinkOpenButtonProps({ linkTitle });

  return (
    <a
      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 text-[11px] font-extrabold text-white transition hover:bg-slate-800"
      href={link.url}
      rel="noreferrer"
      target="_blank"
      title={buttonProps.title}
      aria-label={buttonProps['aria-label']}
    >
      {buttonProps.label}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}
