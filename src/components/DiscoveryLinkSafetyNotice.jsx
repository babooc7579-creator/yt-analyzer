import { getDiscoveryLinkSafetyNoticeViewProps } from '../utils/discoveryLinksCopy';

export default function DiscoveryLinkSafetyNotice() {
  const { description, title } = getDiscoveryLinkSafetyNoticeViewProps();

  return (
    <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-xs leading-relaxed text-emerald-100">
      <p className="font-extrabold">{title}</p>
      <p className="mt-1">
        {description}
      </p>
    </div>
  );
}
