import { ShieldCheck } from 'lucide-react';

import { getDiscoveryLinksHeaderTitleViewProps } from '../utils/discoveryLinksCopy';

export default function DiscoveryLinksHeaderTitle({ totalLinkCount }) {
  const {
    description,
    eyebrow,
    title,
  } = getDiscoveryLinksHeaderTitleViewProps({ totalLinkCount });

  return (
    <div>
      <div className="flex items-center gap-2 text-indigo-700">
        <ShieldCheck className="h-5 w-5" />
        <p className="text-xs font-extrabold uppercase">{eyebrow}</p>
      </div>
      <h3 className="mt-1 text-xl font-extrabold text-slate-950">{title}</h3>
      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}
