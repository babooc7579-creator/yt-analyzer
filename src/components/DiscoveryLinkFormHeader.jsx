import { Link as LinkIcon } from 'lucide-react';

import { getDiscoveryLinkFormHeaderViewProps } from '../utils/discoveryLinksCopy';

export default function DiscoveryLinkFormHeader() {
  const { description, title } = getDiscoveryLinkFormHeaderViewProps();

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
        <LinkIcon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-lg font-extrabold text-white">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}
