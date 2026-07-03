import { PRODUCTION_STATUS } from '../constants/status';

export default function ProductionVideoMetaBadges({ columnId, scheduleSignal, video }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{video.channel_title || video.channelTitle || '채널 정보 없음'}</span>
      {columnId !== PRODUCTION_STATUS.CANDIDATE && (
        <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${scheduleSignal.tone}`}>{scheduleSignal.label}</span>
      )}
      {video.multiplier !== undefined && (
        <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-600">대박 지수 {Number(video.multiplier || 0).toFixed(1)}x</span>
      )}
    </div>
  );
}
