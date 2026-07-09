import { CheckCircle2, Clock } from 'lucide-react';

import { PRODUCTION_STATUS } from '../constants/status';
import { getIsoTodayDate } from '../utils/dates';
import {
  getProductionVideoMoveActionCopy,
  getProductionVideoMoveHandler,
} from '../utils/productionVideoStatusProps';
import ProductionVideoMoveButton from './ProductionVideoMoveButton';

export default function ProductionVideoMoveActions({
  columnId,
  isMoving,
  onMove,
  record,
  video,
  videoTitle,
}) {
  const videoId = video?.videoId;
  const canMove = Boolean(videoId) && typeof onMove === 'function';
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
          disabled={!canMove}
          isMoving={isMoving}
          label={candidateCopy.label}
          onClick={getProductionVideoMoveHandler({
            onMove,
            targetStatus: PRODUCTION_STATUS.CANDIDATE,
            videoId,
          })}
          title={candidateCopy.title}
        />
      )}
      {columnId !== PRODUCTION_STATUS.ACTIVE && (
        <ProductionVideoMoveButton
          activeClassName="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          ariaLabel={activeCopy.ariaLabel}
          disabled={!canMove}
          icon={Clock}
          isMoving={isMoving}
          label={activeCopy.label}
          onClick={getProductionVideoMoveHandler({
            onMove,
            targetStatus: PRODUCTION_STATUS.ACTIVE,
            videoId,
          })}
          title={activeCopy.title}
        />
      )}
      {columnId !== PRODUCTION_STATUS.DONE && (
        <ProductionVideoMoveButton
          activeClassName="bg-slate-900 text-white hover:bg-slate-800"
          ariaLabel={doneCopy.ariaLabel}
          disabled={!canMove}
          icon={CheckCircle2}
          isMoving={isMoving}
          label={doneCopy.label}
          onClick={getProductionVideoMoveHandler({
            onMove,
            targetStatus: PRODUCTION_STATUS.DONE,
            updates: { uploadedAt: record?.uploadedAt || getIsoTodayDate() },
            videoId,
          })}
          title={doneCopy.title}
        />
      )}
    </>
  );
}
