import { TTOTTO_MIN_DAYS_OLD, TTOTTO_MIN_MULTIPLIER } from './video';

export const getVideoListRowStatsViewProps = ({ isStrongReaction, video }) => ({
  daysOldCellProps: {
    className: video.daysOld >= TTOTTO_MIN_DAYS_OLD ? 'bg-orange-50 border-orange-100 text-orange-700' : 'bg-white/80 border-slate-200 text-slate-600',
    label: '경과일',
    minWidthClassName: 'min-w-[120px]',
    roundedRight: true,
  },
  daysOldText: `${video.daysOld}일`,
  engagementCellProps: {
    label: '참여율',
  },
  engagementTextClassName: `text-base font-extrabold ${video.like_ratio >= 3 ? 'text-rose-600' : 'text-slate-700'}`,
  engagementText: `${video.like_ratio}%`,
  likeCountText: `좋아요 ${video.like_count.toLocaleString()}`,
  multiplierCellProps: {
    className: isStrongReaction ? 'bg-rose-600 border-rose-600 text-white' : video.multiplier >= TTOTTO_MIN_MULTIPLIER ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-white/80 border-slate-200 text-slate-600',
    label: '대박 지수',
    labelClassName: isStrongReaction ? 'text-rose-100' : 'text-slate-400',
  },
  multiplierText: `${video.multiplier.toFixed(1)}x`,
  showTrendingIcon: isStrongReaction,
  uploadDateText: `(${video.upload_date})`,
  viewCountCellProps: {
    label: '총 조회수',
    minWidthClassName: 'min-w-[120px]',
  },
  viewCountText: video.view_count.toLocaleString(),
});
