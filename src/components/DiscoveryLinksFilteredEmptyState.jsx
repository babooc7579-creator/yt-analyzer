import { X } from 'lucide-react';

import { getDiscoveryLinksFilteredEmptyStateViewProps } from '../utils/discoveryLinksCopy';

export default function DiscoveryLinksFilteredEmptyState({
  allLinkCount,
  clearFilters,
}) {
  const {
    clearButtonProps,
    description,
    title,
  } = getDiscoveryLinksFilteredEmptyStateViewProps({ allLinkCount });

  return (
    <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="text-sm font-extrabold text-slate-700">{title}</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        {description}
      </p>
      <button
        className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100"
        onClick={clearFilters}
        title={clearButtonProps.title}
        aria-label={clearButtonProps['aria-label']}
        type="button"
      >
        <X className="h-4 w-4" />
        {clearButtonProps.label}
      </button>
    </div>
  );
}
