import { TrendingUp } from 'lucide-react';

import { getVideoListRowStatsViewProps } from '../utils/videoListRowStatsProps';
import VideoListRowStatCell from './VideoListRowStatCell';

export default function VideoListRowStatsCells({ isStrongReaction, video }) {
  const {
    daysOldCellProps,
    daysOldText,
    engagementCellProps,
    engagementText,
    engagementTextClassName,
    likeCountText,
    multiplierCellProps,
    multiplierText,
    showTrendingIcon,
    uploadDateText,
    viewCountCellProps,
    viewCountText,
  } = getVideoListRowStatsViewProps({
    isStrongReaction,
    video,
  });

  return (
    <>
      <VideoListRowStatCell {...viewCountCellProps}>
        <span className="text-base font-extrabold text-slate-800">{viewCountText}</span>
      </VideoListRowStatCell>
      <VideoListRowStatCell {...multiplierCellProps}>
        <span className="inline-flex items-center justify-end gap-1 text-lg font-extrabold">
          {showTrendingIcon && <TrendingUp className="w-4 h-4" />}
          {multiplierText}
        </span>
      </VideoListRowStatCell>
      <VideoListRowStatCell {...engagementCellProps}>
        <span className={engagementTextClassName}>{engagementText}</span>
        <span className="text-[10px] text-slate-400">{likeCountText}</span>
      </VideoListRowStatCell>
      <VideoListRowStatCell {...daysOldCellProps}>
        <span className="text-base font-extrabold">{daysOldText}</span>
        <span className="text-[10px] text-slate-400 font-normal">{uploadDateText}</span>
      </VideoListRowStatCell>
    </>
  );
}
