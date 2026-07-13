import { CheckSquare, ExternalLink, Square } from 'lucide-react';

import { getChannelWatchlistCardViewProps } from '../utils/channelWatchlist';

export default function ChannelWatchlistCard({
  channel,
  isSelected,
  onToggleSelection,
}) {
  const viewProps = getChannelWatchlistCardViewProps({ channel, isSelected });

  return (
    <article className={`border p-4 ${isSelected ? 'border-cyan-400/50 bg-cyan-500/10' : 'border-slate-800 bg-slate-950/60'}`}>
      <div className="flex items-start gap-3">
        {viewProps.thumbnail ? (
          <img src={viewProps.thumbnail} alt="" className="h-12 w-12 shrink-0 rounded-full border border-slate-700 object-cover" />
        ) : (
          <div className="h-12 w-12 shrink-0 rounded-full border border-slate-700 bg-slate-800" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-extrabold text-white" title={viewProps.channelTitle}>{viewProps.channelTitle}</h3>
              <p className="mt-1 text-[11px] font-bold text-slate-500">{viewProps.gradeLabel} · {viewProps.scanText}</p>
            </div>
            <a
              href={viewProps.channelUrl}
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-white"
              title="YouTube 채널을 엽니다. 앱의 YouTube API 호출은 없습니다."
              aria-label={`${viewProps.channelTitle} YouTube 채널 열기`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {viewProps.reasons.map((reason) => (
              <span key={reason} className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] font-bold text-slate-300">
                {reason}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onToggleSelection(channel.id)}
        className={`mt-4 inline-flex w-full items-center justify-center gap-2 border px-3 py-2 text-xs font-extrabold ${
          isSelected
            ? 'border-cyan-300 bg-cyan-200 text-cyan-950'
            : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-500'
        }`}
        title={`${viewProps.selectionLabel}. 선택만으로 Cloud 조회나 YouTube API 호출은 실행되지 않습니다.`}
      >
        {isSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
        {viewProps.selectionLabel}
      </button>
    </article>
  );
}
