import { TTOTTO_MIN_DAYS_OLD, TTOTTO_MIN_MULTIPLIER } from '../utils/video';
import VideoCardStatTile from './VideoCardStatTile';

export default function VideoCardStatsGrid({ isStrongReaction, showWorkPanel, video }) {
  const statPaddingClass = showWorkPanel ? 'p-3' : 'p-2.5';

  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      <VideoCardStatTile label="총 조회수" paddingClassName={statPaddingClass}>
        <p className="text-sm font-extrabold text-slate-800">{video.view_count.toLocaleString()}</p>
      </VideoCardStatTile>
      <VideoCardStatTile
        className={isStrongReaction ? 'border-rose-500 bg-rose-600 text-white' : video.multiplier >= TTOTTO_MIN_MULTIPLIER ? 'border-indigo-100 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-700'}
        label="대박 지수"
        labelClassName={isStrongReaction ? 'text-rose-100' : 'text-slate-400'}
        paddingClassName={statPaddingClass}
      >
        <p className="text-sm font-extrabold">{video.multiplier.toFixed(1)}x</p>
      </VideoCardStatTile>
      <VideoCardStatTile label="참여율" paddingClassName={statPaddingClass}>
        <p className={`text-sm font-extrabold ${video.like_ratio >= 3 ? 'text-rose-600' : 'text-slate-800'}`}>{video.like_ratio}% <span className="text-[10px] font-medium text-slate-400">좋아요 {video.like_count.toLocaleString()}</span></p>
      </VideoCardStatTile>
      <VideoCardStatTile
        className={video.daysOld >= TTOTTO_MIN_DAYS_OLD ? 'border-orange-100 bg-orange-50 text-orange-700' : 'border-slate-200 bg-slate-50 text-slate-700'}
        label="경과일"
        paddingClassName={statPaddingClass}
      >
        <p className="text-sm font-extrabold">{video.daysOld}일</p>
      </VideoCardStatTile>
    </div>
  );
}
