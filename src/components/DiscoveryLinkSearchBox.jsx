import { Search, X } from 'lucide-react';

import { getDiscoveryLinkSearchBoxViewProps } from '../utils/discoveryLinksCopy';

export default function DiscoveryLinkSearchBox({
  searchQuery,
  setSearchQuery,
}) {
  const viewProps = getDiscoveryLinkSearchBoxViewProps();

  return (
    <div className="mt-3">
      <label className="sr-only" htmlFor="discovery-link-search">
        {viewProps.label}
      </label>
      <div className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-500 transition focus-within:border-indigo-400 focus-within:bg-white">
        <Search className="h-4 w-4 shrink-0" />
        <input
          className="min-w-0 flex-1 bg-transparent py-2 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
          id="discovery-link-search"
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={viewProps.inputPlaceholder}
          type="search"
          value={searchQuery}
          aria-label={viewProps.inputAriaLabel}
        />
        {searchQuery ? (
          <button
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
            onClick={() => setSearchQuery('')}
            type="button"
            {...viewProps.clearButtonProps}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
