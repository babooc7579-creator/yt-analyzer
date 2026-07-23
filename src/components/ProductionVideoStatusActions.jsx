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
      <p className="text-[10px] font-extrabold text-slate-500">3. 다음 제작 단계 선택</p>
      <p className="rounded-lg bg-slate-50 px-3 py-2 text-[10px] font-bold leading-relaxed text-slate-500">
        {PRODUCTION_VIDEO_STATUS_HELP_TEXT}
      </p>
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
