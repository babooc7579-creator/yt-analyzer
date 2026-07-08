import { PRODUCTION_STATUS } from '../constants/status';
import { getProductionVideoMetaBadgesViewProps } from '../utils/productionVideoCard';

export default function ProductionVideoMetaBadges({ columnId, scheduleSignal, video }) {
  const {
    channelLabel,
    multiplierLabel,
  } = getProductionVideoMetaBadgesViewProps({ video });

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{channelLabel}</span>
      {columnId !== PRODUCTION_STATUS.CANDIDATE && (
        <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${scheduleSignal.tone}`}>{scheduleSignal.label}</span>
      )}
      {multiplierLabel && (
        <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-600">{multiplierLabel}</span>
      )}
    </div>
  );
}
