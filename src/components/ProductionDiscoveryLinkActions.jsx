import { FilePenLine } from 'lucide-react';

import { getProductionDiscoveryLinkScriptButtonProps } from '../utils/productionDiscoveryLinkActionProps';
import ProductionDiscoveryLinkCopyButton from './ProductionDiscoveryLinkCopyButton';
import ProductionDiscoveryLinkEditButton from './ProductionDiscoveryLinkEditButton';
import ProductionDiscoveryLinkOpenButton from './ProductionDiscoveryLinkOpenButton';
import ProductionDiscoveryLinkMoveActions from './ProductionDiscoveryLinkMoveActions';
import ProductionDiscoveryLinkMoveStatus from './ProductionDiscoveryLinkMoveStatus';

export default function ProductionDiscoveryLinkActions({
  isMoving,
  link,
  linkTitle,
  moveState,
  onEditInDiscoveryLinks,
  onMove,
  onOpenScriptBoard,
}) {
  const {
    label: scriptButtonLabel,
    ...scriptButtonProps
  } = getProductionDiscoveryLinkScriptButtonProps({
    link,
    linkTitle,
    onOpenScriptBoard,
  });

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-[11px] font-extrabold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          {...scriptButtonProps}
        >
          <FilePenLine className="h-3.5 w-3.5" />
          {scriptButtonLabel}
        </button>
        <ProductionDiscoveryLinkOpenButton link={link} linkTitle={linkTitle} />
        <ProductionDiscoveryLinkCopyButton
          disabled={isMoving}
          link={link}
          linkTitle={linkTitle}
        />
        <ProductionDiscoveryLinkEditButton
          disabled={isMoving}
          linkTitle={linkTitle}
          onClick={onEditInDiscoveryLinks}
        />
        <ProductionDiscoveryLinkMoveActions
          isMoving={isMoving}
          link={link}
          linkTitle={linkTitle}
          onMove={onMove}
        />
      </div>
      <ProductionDiscoveryLinkMoveStatus moveState={moveState} />
    </>
  );
}
