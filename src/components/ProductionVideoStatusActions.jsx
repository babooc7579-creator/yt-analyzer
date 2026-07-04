import { PRODUCTION_STATUS } from '../constants/status';
import ProductionVideoExternalActions from './ProductionVideoExternalActions';
import ProductionVideoMoveActions from './ProductionVideoMoveActions';
import ProductionVideoMoveStatus from './ProductionVideoMoveStatus';

export default function ProductionVideoStatusActions({
  columnId,
  isMoving,
  moveState,
  onMove,
  record,
  video,
  videoTitle,
  videoUrl,
}) {
  return (
    <div className="mt-3 grid grid-cols-1 gap-2">
      <p className="rounded-lg bg-slate-50 px-3 py-2 text-[10px] font-bold leading-relaxed text-slate-500">
        아래 상태 버튼은 이 영상의 제작 진행 상태를 Cloud 판단 기록에 저장합니다. YouTube API를 새로 호출하지 않습니다.
      </p>
      <ProductionVideoMoveActions
        columnId={columnId}
        isMoving={isMoving}
        onMove={onMove}
        record={record}
        video={video}
        videoTitle={videoTitle}
      />
      <ProductionVideoMoveStatus columnId={columnId} moveState={moveState} uploadedAt={record.uploadedAt} />
      <ProductionVideoExternalActions videoTitle={videoTitle} videoUrl={videoUrl} />
    </div>
  );
}
