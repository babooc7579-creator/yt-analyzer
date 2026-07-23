import { PRODUCTION_VIDEO_STATUS_HELP_TEXT } from '../utils/productionVideoStatusProps';
import ProductionVideoMoveActions from './ProductionVideoMoveActions';
import ProductionVideoMoveStatus from './ProductionVideoMoveStatus';

export default function ProductionVideoStatusActions({
  columnId,
  isMoving,
  moveState,
  onFocus,
  onMove,
  record,
  video,
  videoTitle,
}) {
  return (
    <div className="mt-3 grid grid-cols-1 gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-extrabold text-slate-500">3. 다음 제작 단계 선택</p>
        <span
          className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500"
          title={PRODUCTION_VIDEO_STATUS_HELP_TEXT}
        >
          Cloud 저장 · API 호출 없음
        </span>
      </div>
      <ProductionVideoMoveActions
        columnId={columnId}
        isMoving={isMoving}
        onFocus={onFocus}
        onMove={onMove}
        record={record}
        video={video}
        videoTitle={videoTitle}
      />
      <ProductionVideoMoveStatus columnId={columnId} moveState={moveState} uploadedAt={record.uploadedAt} />
    </div>
  );
}
