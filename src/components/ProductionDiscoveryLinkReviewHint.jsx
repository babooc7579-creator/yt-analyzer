import { getProductionDiscoveryLinkReviewHintProps } from '../utils/productionDiscoveryLinkActionProps';

export default function ProductionDiscoveryLinkReviewHint({ rightsWarning }) {
  const { items, title } = getProductionDiscoveryLinkReviewHintProps({ rightsWarning });

  return (
    <div className="mt-3 rounded-lg border border-white bg-white/70 p-3">
      <p className="text-[11px] font-extrabold text-slate-700">{title}</p>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.key} className="rounded-lg bg-slate-50 p-2">
            <p className="text-[10px] font-extrabold text-slate-500">{item.label}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
