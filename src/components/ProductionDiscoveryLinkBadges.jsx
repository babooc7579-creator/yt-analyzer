import { getDiscoveryRightsStatusLabel } from '../constants/discoveryLinks';

export default function ProductionDiscoveryLinkBadges({
  platformLabel,
  rightsStatus,
  rightsTone,
  sourceHost,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-extrabold text-amber-800">링크 후보</span>
      <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-extrabold text-white">
        {platformLabel}
      </span>
      <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-extrabold text-slate-600">
        출처 {sourceHost}
      </span>
      <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${rightsTone.compactBadge}`}>
        {getDiscoveryRightsStatusLabel(rightsStatus)}
      </span>
    </div>
  );
}
