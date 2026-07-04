import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

import { PRODUCTION_STATUS } from '../constants/status';
import { getIsoTodayDate } from '../utils/dates';
import ProductionVideoExternalActions from './ProductionVideoExternalActions';
import ProductionVideoMoveButton from './ProductionVideoMoveButton';

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
      {moveState === 'error' && (
        <p className="inline-flex items-center justify-center gap-1 text-[10px] font-bold text-red-600">
          <AlertCircle className="h-3 w-3" /> 상태 저장 실패. 다시 눌러 주세요.
        </p>
      )}
      {columnId === PRODUCTION_STATUS.DONE && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-[11px] font-bold text-slate-600">
          업로드 완료일 {record.uploadedAt || '기록 없음'}
        </div>
      )}
      <ProductionVideoExternalActions videoTitle={videoTitle} videoUrl={videoUrl} />
    </div>
  );
}
