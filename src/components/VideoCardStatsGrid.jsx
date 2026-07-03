import { TTOTTO_MIN_DAYS_OLD, TTOTTO_MIN_MULTIPLIER } from '../utils/video';

export default function VideoCardStatsGrid({ isStrongReaction, showWorkPanel, video }) {
  const statPaddingClass = showWorkPanel ? 'p-3' : 'p-2.5';

  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      <div className={`${statPaddingClass} rounded-lg border border-slate-200 bg-slate-50`}>
        <p className="text-[10px] font-bold text-slate-400">총 조회수</p>
        <p className="text-sm font-extrabold text-slate-800">{video.view_count.toLocaleString()}</p>
      </div>
      <div className={`${statPaddingClass} rounded-lg border ${isStrongReaction ? 'border-rose-500 bg-rose-600 text-white' : video.multiplier >= TTOTTO_MIN_MULTIPLIER ? 'border-indigo-100 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
        <p className={`text-[10px] font-bold ${isStrongReaction ? 'text-rose-100' : 'text-slate-400'}`}>대박 지수</p>
        <p className="text-sm font-extrabold">{video.multiplier.toFixed(1)}x</p>
      </div>
      <div className={`${statPaddingClass} rounded-lg border border-slate-200 bg-slate-50`}>
        <p className="text-[10px] font-bold text-slate-400">참여율</p>
        <p className={`text-sm font-extrabold ${video.like_ratio >= 3 ? 'text-rose-600' : 'text-slate-800'}`}>{video.like_ratio}% <span className="text-[10px] font-medium text-slate-400">좋아요 {video.like_count.toLocaleString()}</span></p>
      </div>
      <div className={`${statPaddingClass} rounded-lg border ${video.daysOld >= TTOTTO_MIN_DAYS_OLD ? 'border-orange-100 bg-orange-50 text-orange-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
        <p className="text-[10px] font-bold text-slate-400">경과일</p>
        <p className="text-sm font-extrabold">{video.daysOld}일</p>
      </div>
    </div>
  );
}
