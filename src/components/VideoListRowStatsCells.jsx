import { TrendingUp } from 'lucide-react';

import { TTOTTO_MIN_DAYS_OLD, TTOTTO_MIN_MULTIPLIER } from '../utils/video';
import VideoListRowStatCell from './VideoListRowStatCell';

export default function VideoListRowStatsCells({ isStrongReaction, video }) {
  return (
    <>
      <VideoListRowStatCell label="총 조회수" minWidthClassName="min-w-[120px]">
        <span className="text-base font-extrabold text-slate-800">{video.view_count.toLocaleString()}</span>
      </VideoListRowStatCell>
      <VideoListRowStatCell
        className={isStrongReaction ? 'bg-rose-600 border-rose-600 text-white' : video.multiplier >= TTOTTO_MIN_MULTIPLIER ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-white/80 border-slate-200 text-slate-600'}
        label="대박 지수"
        labelClassName={isStrongReaction ? 'text-rose-100' : 'text-slate-400'}
      >
        <span className="inline-flex items-center justify-end gap-1 text-lg font-extrabold">
          {isStrongReaction && <TrendingUp className="w-4 h-4" />}
          {video.multiplier.toFixed(1)}x
        </span>
      </VideoListRowStatCell>
      <VideoListRowStatCell label="참여율">
        <span className={`text-base font-extrabold ${video.like_ratio >= 3 ? 'text-rose-600' : 'text-slate-700'}`}>{video.like_ratio}%</span>
        <span className="text-[10px] text-slate-400">좋아요 {video.like_count.toLocaleString()}</span>
      </VideoListRowStatCell>
      <VideoListRowStatCell
        className={video.daysOld >= TTOTTO_MIN_DAYS_OLD ? 'bg-orange-50 border-orange-100 text-orange-700' : 'bg-white/80 border-slate-200 text-slate-600'}
        label="경과일"
        minWidthClassName="min-w-[120px]"
        roundedRight
      >
        <span className="text-base font-extrabold">{video.daysOld}일</span>
        <span className="text-[10px] text-slate-400 font-normal">({video.upload_date})</span>
      </VideoListRowStatCell>
    </>
  );
}
