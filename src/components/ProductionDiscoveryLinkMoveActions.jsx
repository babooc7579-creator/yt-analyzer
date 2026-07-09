import { getProductionDiscoveryLinkMoveActions } from '../utils/productionDiscoveryLinkActionProps';
import ProductionDiscoveryLinkMoveButton from './ProductionDiscoveryLinkMoveButton';

export default function ProductionDiscoveryLinkMoveActions({
  isMoving,
  link,
  linkTitle,
  onMove,
}) {
  const moveActions = getProductionDiscoveryLinkMoveActions({
    link,
    linkTitle,
    onMove,
  });

  return (
    <>
      {moveActions.map((action) => (
        <ProductionDiscoveryLinkMoveButton
          key={action.targetStatus}
          ariaLabel={action.ariaLabel}
          disabled={isMoving || action.disabled}
          onClick={action.onClick}
          title={action.title}
          isMoving={isMoving}
          label={action.label}
          tone={action.tone}
        />
      ))}
    </>
  );
}
