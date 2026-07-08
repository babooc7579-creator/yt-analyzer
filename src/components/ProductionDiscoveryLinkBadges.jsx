import { getDiscoveryRightsStatusLabel } from '../constants/discoveryLinks';
import { getProductionDiscoveryLinkBadgesViewProps } from '../utils/productionDiscoveryLinkActionProps';

export default function ProductionDiscoveryLinkBadges({
  platformLabel,
  rightsStatus,
  rightsTone,
  sourceHost,
}) {
  const {
    candidateLabel,
    sourceLabel,
  } = getProductionDiscoveryLinkBadgesViewProps({ sourceHost });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-extrabold text-amber-800">{candidateLabel}</span>
      <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-extrabold text-white">
        {platformLabel}
      </span>
      <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-extrabold text-slate-600">
        {sourceLabel}
      </span>
      <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${rightsTone.compactBadge}`}>
        {getDiscoveryRightsStatusLabel(rightsStatus)}
      </span>
    </div>
  );
}
