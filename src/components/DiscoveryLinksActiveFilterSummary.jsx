import { getDiscoveryLinksActiveFilterSummaryViewProps } from '../utils/discoveryLinksCopy';

export default function DiscoveryLinksActiveFilterSummary({ filteredLinkCount }) {
  const { message } = getDiscoveryLinksActiveFilterSummaryViewProps({ filteredLinkCount });

  return (
    <p className="mt-2 text-[11px] font-semibold text-slate-500">
      {message}
    </p>
  );
}
