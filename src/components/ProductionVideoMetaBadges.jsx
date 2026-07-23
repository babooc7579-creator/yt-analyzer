import { PRODUCTION_STATUS } from '../constants/status';
import { getProductionVideoMetaBadgesViewProps } from '../utils/productionVideoCard';

export default function ProductionVideoMetaBadges({ columnId, record, scheduleSignal, video }) {
  const {
    channelLabel,
    multiplierLabel,
    targetPublishDateLabel,
  } = getProductionVideoMetaBadgesViewProps({ record, video });
  const hasScheduleSignal = scheduleSignal && typeof scheduleSignal === 'object';

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{channelLabel}</span>
      {columnId !== PRODUCTION_STATUS.CANDIDATE && hasScheduleSignal && (
        <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${scheduleSignal.tone}`}>{scheduleSignal.label}</span>
      )}
      {targetPublishDateLabel && (
        <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
          {targetPublishDateLabel}
        </span>
      )}
      {multiplierLabel && (
        <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-600">{multiplierLabel}</span>
      )}
    </div>
  );
}
