import { formatKoreanDateTime } from '../utils/dates';
import { getDiscoveryLinkUpdatedAtViewProps } from '../utils/discoveryLinksCopy';

export default function DiscoveryLinkUpdatedAt({ link }) {
  const { fallbackText } = getDiscoveryLinkUpdatedAtViewProps();
  const { message } = getDiscoveryLinkUpdatedAtViewProps({
    formattedDate: formatKoreanDateTime(link.updatedAt || link.createdAt, fallbackText),
  });

  return (
    <p className="mt-3 text-[11px] font-semibold text-slate-400">
      {message}
    </p>
  );
}
