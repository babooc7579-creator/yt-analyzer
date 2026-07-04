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
}) {
  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2">
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
