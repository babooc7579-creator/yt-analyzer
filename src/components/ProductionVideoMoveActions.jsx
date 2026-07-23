import { CheckCircle2, Clock, Pin, PinOff } from 'lucide-react';

import { PRODUCTION_FOCUS_COLUMN_ID } from '../constants/productionKanban';
import { PRODUCTION_STATUS } from '../constants/status';
import { getIsoTodayDate } from '../utils/dates';
import {
  getProductionVideoFocusActionCopy,
  getProductionVideoFocusHandler,
  getProductionVideoMoveActionCopy,
  getProductionVideoMoveHandler,
} from '../utils/productionVideoStatusProps';
import ProductionVideoMoveButton from './ProductionVideoMoveButton';

export default function ProductionVideoMoveActions({
  columnId,
  isMoving,
  onFocus,
  onMove,
  record,
  video,
  videoTitle,
}) {
  const videoId = video?.videoId;
  const canFocus = Boolean(videoId) && typeof onFocus === 'function';
  const canMove = Boolean(videoId) && typeof onMove === 'function';
  const isFocused = columnId === PRODUCTION_FOCUS_COLUMN_ID;
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
  const focusCopy = getProductionVideoFocusActionCopy({ isFocused, videoTitle });

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {columnId === PRODUCTION_STATUS.CANDIDATE && (
        <ProductionVideoMoveButton
          activeClassName="bg-amber-100 text-amber-900 hover:bg-amber-200"
          ariaLabel={focusCopy.ariaLabel}
          disabled={!canFocus}
          icon={Pin}
          isMoving={isMoving}
          label={focusCopy.label}
          onClick={getProductionVideoFocusHandler({ onFocus, videoId })}
          title={focusCopy.title}
        />
      )}
      {isFocused && (
        <ProductionVideoMoveButton
          activeClassName="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          ariaLabel={focusCopy.ariaLabel}
          baseClassName="block text-center"
          disabled={!canFocus}
          icon={PinOff}
          isMoving={isMoving}
          label={focusCopy.label}
          onClick={getProductionVideoFocusHandler({
            focusPinnedAt: record?.focusPinnedAt,
            onFocus,
            videoId,
          })}
          title={focusCopy.title}
        />
      )}
      {columnId !== PRODUCTION_STATUS.CANDIDATE && !isFocused && (
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
            updates: { focusPinnedAt: '' },
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
            updates: { focusPinnedAt: '' },
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
            updates: {
              focusPinnedAt: '',
              uploadedAt: record?.uploadedAt || getIsoTodayDate(),
            },
            videoId,
          })}
          title={doneCopy.title}
        />
      )}
    </div>
  );
}
