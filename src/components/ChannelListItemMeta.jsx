import { getLanguageLabel } from '../constants/languages';
import {
  CHANNEL_GRADE_LABELS,
  CHANNEL_GRADE_TONES,
  CHANNEL_STATUS_LABELS,
  CHANNEL_STATUS_TONES,
} from '../constants/status';
import { formatCompactKo } from '../utils/formatters';

export default function ChannelListItemMeta({
  channel,
  grade,
  status,
}) {
  return (
    <div className="flex items-center gap-x-2 gap-y-1 flex-wrap mt-1">
      <span className="text-[10px] font-medium text-slate-500">{getLanguageLabel(channel.language)}</span>
      <span className={`rounded-full border px-2 py-0.5 text-[9px] font-extrabold ${CHANNEL_GRADE_TONES[grade]}`}>
        등급 {CHANNEL_GRADE_LABELS[grade]}
      </span>
      <span className={`rounded-full border px-2 py-0.5 text-[9px] font-extrabold ${CHANNEL_STATUS_TONES[status]}`}>
        {CHANNEL_STATUS_LABELS[status]}
      </span>
      {channel.stats && (
        <>
          <span className="text-[9px] text-slate-400" title="구독자 수">👤{formatCompactKo(channel.stats.subscriberCount)}</span>
          <span className="text-[9px] text-slate-400" title="전체 영상 수">🎬{formatCompactKo(channel.stats.totalVideoCount)}</span>
          <span className="text-[9px] text-slate-400" title="평균 조회수">👁️{formatCompactKo(channel.stats.avgViewCount)}</span>
        </>
      )}
    </div>
  );
}
