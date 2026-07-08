import {
  getDiscoveryLinkStatusLabel,
  getDiscoveryRightsStatusLabel,
} from '../constants/discoveryLinks';
import { getDiscoveryLinkSourceBadgeLabel } from '../utils/discoveryLinksCopy';

export default function DiscoveryLinkBadges({
  currentRightsStatus,
  currentStatus,
  platformLabel,
  rightsTone,
  sourceHost,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-extrabold text-white">
        {platformLabel}
      </span>
      <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-extrabold text-slate-600">
        {getDiscoveryLinkSourceBadgeLabel(sourceHost)}
      </span>
      <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-extrabold text-indigo-700">
        {getDiscoveryLinkStatusLabel(currentStatus)}
      </span>
      <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${rightsTone.badge}`}>
        {getDiscoveryRightsStatusLabel(currentRightsStatus)}
      </span>
    </div>
  );
}
