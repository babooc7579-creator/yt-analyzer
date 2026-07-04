import CopyUrlButton from './CopyUrlButton';
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
        <CopyUrlButton
          url={link.url}
          label="링크 복사"
          copiedLabel="복사 완료"
          copyingLabel="복사 중"
          errorLabel="복사 실패"
          disabled={isMoving}
          ariaLabel={`${linkTitle} 원본 링크 URL 복사`}
          title="원본 링크 URL을 클립보드에 복사합니다. 외부 사이트 수집이나 저장 작업은 없습니다."
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-extrabold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          iconClassName="h-3.5 w-3.5"
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
