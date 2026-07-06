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
        ariaLabel={`${linkTitle} 제작 후보 표시를 해제하고 Cloud 발견함 받은 링크 상태로 저장`}
        disabled={isMoving}
        onClick={() => onMove(link.id, 'inbox')}
        title="제작 후보 표시만 해제하고 Cloud 발견함 상태를 받은 링크로 저장합니다. 링크 기록은 삭제되지 않습니다."
        isMoving={isMoving}
        label="발견함으로 되돌리기"
      />
      <ProductionDiscoveryLinkMoveButton
        ariaLabel={`${linkTitle} 링크 삭제 없이 Cloud 발견함 후보 제외 상태로 저장`}
        disabled={isMoving}
        onClick={() => onMove(link.id, 'discarded')}
        title="링크 기록을 삭제하지 않고 Cloud 발견함의 후보 제외 상태로 저장합니다."
        isMoving={isMoving}
        label="후보 제외"
        tone="danger"
      />
    </>
  );
}
