import ProductionDiscoveryLinkCopyButton from './ProductionDiscoveryLinkCopyButton';
import ProductionDiscoveryLinkEditButton from './ProductionDiscoveryLinkEditButton';
import ProductionDiscoveryLinkOpenButton from './ProductionDiscoveryLinkOpenButton';
import ProductionDiscoveryLinkMoveButton from './ProductionDiscoveryLinkMoveButton';
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
        <ProductionDiscoveryLinkMoveButton
          ariaLabel={`${linkTitle} 발견함으로 되돌리기`}
          disabled={isMoving}
          onClick={() => onMove(link.id, 'inbox')}
          title="제작 후보에서 빼고 발견함 받은 링크 상태로 저장"
          isMoving={isMoving}
          label="발견함으로 되돌리기"
        />
        <ProductionDiscoveryLinkMoveButton
          ariaLabel={`${linkTitle} 제작 후보에서 제외 상태로 저장`}
          disabled={isMoving}
          onClick={() => onMove(link.id, 'discarded')}
          title="링크를 삭제하지 않고 발견함의 후보 제외 상태로 저장합니다"
          isMoving={isMoving}
          label="후보 제외"
          tone="danger"
        />
      </div>
      <ProductionDiscoveryLinkMoveStatus moveState={moveState} />
    </>
  );
}
