import { getDiscoveryLinksActiveFilterSummaryViewProps } from '../utils/discoveryLinksCopy';

export default function DiscoveryLinksActiveFilterSummary({ filteredLinkCount, onClearFilters }) {
  const { clearButtonProps, message } = getDiscoveryLinksActiveFilterSummaryViewProps({ filteredLinkCount });

  return (
    <div className="mt-3 flex flex-col gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[11px] font-semibold text-indigo-700">
        {message}
      </p>
      <button
        className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-indigo-200 bg-white px-3 text-[11px] font-extrabold text-indigo-700 transition hover:bg-indigo-100"
        onClick={onClearFilters}
        type="button"
        {...clearButtonProps}
      >
        {clearButtonProps.label}
      </button>
    </div>
  );
}
