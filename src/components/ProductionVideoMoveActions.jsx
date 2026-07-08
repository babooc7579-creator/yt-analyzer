import { CheckCircle2, Clock } from 'lucide-react';

import { PRODUCTION_STATUS } from '../constants/status';
import { getIsoTodayDate } from '../utils/dates';
import { getProductionVideoMoveActionCopy } from '../utils/productionVideoStatusProps';
import ProductionVideoMoveButton from './ProductionVideoMoveButton';

export default function ProductionVideoMoveActions({
  columnId,
  isMoving,
  onMove,
  record,
  video,
  videoTitle,
}) {
  const candidateCopy = getProductionVideoMoveActionCopy({
    targetStatus: PRODUCTION_STATUS.CANDIDATE,
    videoTitle,
  });
  const activeCopy = getProductionVideoMoveActionCopy({
    targetStatus: PRODUCTION_STATUS.ACTIVE,
    videoTitle,
  });
  const doneCopy = getProductionVideoMoveActionCopy({
    targetStatus: PRODUCTION_STATUS.DONE,
    videoTitle,
  });

  return (
    <>
      {columnId !== PRODUCTION_STATUS.CANDIDATE && (
        <ProductionVideoMoveButton
          activeClassName="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          ariaLabel={candidateCopy.ariaLabel}
          baseClassName="block text-center"
          isMoving={isMoving}
          label={candidateCopy.label}
          onClick={() => onMove(video.videoId, PRODUCTION_STATUS.CANDIDATE)}
          title={candidateCopy.title}
        />
      )}
      {columnId !== PRODUCTION_STATUS.ACTIVE && (
        <ProductionVideoMoveButton
          activeClassName="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          ariaLabel={activeCopy.ariaLabel}
          icon={Clock}
          isMoving={isMoving}
          label={activeCopy.label}
          onClick={() => onMove(video.videoId, PRODUCTION_STATUS.ACTIVE)}
          title={activeCopy.title}
        />
      )}
      {columnId !== PRODUCTION_STATUS.DONE && (
        <ProductionVideoMoveButton
          activeClassName="bg-slate-900 text-white hover:bg-slate-800"
          ariaLabel={doneCopy.ariaLabel}
          icon={CheckCircle2}
          isMoving={isMoving}
          label={doneCopy.label}
          onClick={() => onMove(video.videoId, PRODUCTION_STATUS.DONE, { uploadedAt: record.uploadedAt || getIsoTodayDate() })}
          title={doneCopy.title}
        />
      )}
    </>
  );
}
