import { CheckCircle2, Clock } from 'lucide-react';

import { PRODUCTION_STATUS } from '../constants/status';
import { getIsoTodayDate } from '../utils/dates';
import ProductionVideoMoveButton from './ProductionVideoMoveButton';

export default function ProductionVideoMoveActions({
  columnId,
  isMoving,
  onMove,
  record,
  video,
  videoTitle,
}) {
  return (
    <>
      {columnId !== PRODUCTION_STATUS.CANDIDATE && (
        <ProductionVideoMoveButton
          activeClassName="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          ariaLabel={`${videoTitle} 제작 후보로 이동`}
          baseClassName="block text-center"
          isMoving={isMoving}
          label="제작 후보로"
          onClick={() => onMove(video.videoId, PRODUCTION_STATUS.CANDIDATE)}
          title="제작 상태를 후보로 되돌려 저장"
        />
      )}
      {columnId !== PRODUCTION_STATUS.ACTIVE && (
        <ProductionVideoMoveButton
          activeClassName="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          ariaLabel={`${videoTitle} 제작 중으로 이동`}
          icon={Clock}
          isMoving={isMoving}
          label="제작 중으로"
          onClick={() => onMove(video.videoId, PRODUCTION_STATUS.ACTIVE)}
          title="제작 중 상태로 저장"
        />
      )}
      {columnId !== PRODUCTION_STATUS.DONE && (
        <ProductionVideoMoveButton
          activeClassName="bg-slate-900 text-white hover:bg-slate-800"
          ariaLabel={`${videoTitle} 업로드 완료로 이동`}
          icon={CheckCircle2}
          isMoving={isMoving}
          label="업로드 완료"
          onClick={() => onMove(video.videoId, PRODUCTION_STATUS.DONE, { uploadedAt: record.uploadedAt || getIsoTodayDate() })}
          title="업로드 완료 상태로 저장하고 완료일을 기록"
        />
      )}
    </>
  );
}
