import { Link as LinkIcon } from 'lucide-react';
import {
  getProductionDiscoveryLinkCardProps,
  getProductionDiscoveryLinkList,
  getProductionDiscoveryLinksSectionActions,
  getProductionDiscoveryLinksSectionHeaderProps,
} from '../utils/productionDiscoveryLinksSection';
import ProductionDiscoveryLinkCard from './ProductionDiscoveryLinkCard';

export default function ProductionDiscoveryLinksSection({
  links,
  linkMoveStates,
  onOpenDiscoveryLinks,
  onMoveLink,
}) {
  const linkList = getProductionDiscoveryLinkList(links);
  const headerProps = getProductionDiscoveryLinksSectionHeaderProps();
  const { openDiscoveryLinksButtonProps } = getProductionDiscoveryLinksSectionActions({
    onOpenDiscoveryLinks,
  });

  if (linkList.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-amber-100 bg-white p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-extrabold text-amber-700">
            <LinkIcon className="h-4 w-4" />
            {headerProps.eyebrow}
          </p>
          <h3 className="mt-1 text-lg font-extrabold text-slate-900">{headerProps.title}</h3>
          <p className="mt-1 text-xs text-slate-500">
            {headerProps.description}
          </p>
        </div>
        <button
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100"
          {...openDiscoveryLinksButtonProps}
          type="button"
        >
          <LinkIcon className="h-4 w-4" />
          {headerProps.openButtonLabel}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {linkList.map((link) => {
          const cardProps = getProductionDiscoveryLinkCardProps({
            link,
            linkMoveStates,
            onMoveLink,
            onOpenDiscoveryLinks,
          });

          return (
            <ProductionDiscoveryLinkCard key={link.id} {...cardProps} />
          );
        })}
      </div>
    </section>
  );
}
