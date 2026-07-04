import ProductionDiscoveryLinkMoveButton from './ProductionDiscoveryLinkMoveButton';

export default function ProductionDiscoveryLinkMoveActions({
  isMoving,
  link,
  linkTitle,
  onMove,
}) {
  return (
    <>
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
    </>
  );
}
