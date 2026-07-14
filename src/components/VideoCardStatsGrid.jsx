import { getVideoCardStatsGridViewProps } from '../utils/videoCard';
import VideoCardStatTile from './VideoCardStatTile';

export default function VideoCardStatsGrid({ isStrongReaction, showWorkPanel, video }) {
  const {
    daysOldText,
    daysOldTileProps,
    engagementLikeText,
    engagementText,
    engagementTextClassName,
    engagementTileProps,
    multiplierText,
    multiplierTileProps,
    publishedDateText,
    viewCountText,
    viewCountTileProps,
  } = getVideoCardStatsGridViewProps({
    isStrongReaction,
    showWorkPanel,
    video,
  });

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      <VideoCardStatTile {...viewCountTileProps}>
        <p className="text-sm font-extrabold text-slate-800">{viewCountText}</p>
      </VideoCardStatTile>
      <VideoCardStatTile {...multiplierTileProps}>
        <p className="text-sm font-extrabold">{multiplierText}</p>
      </VideoCardStatTile>
      <VideoCardStatTile {...engagementTileProps}>
        <p className={engagementTextClassName}>{engagementText} <span className="text-[10px] font-medium text-slate-400">{engagementLikeText}</span></p>
      </VideoCardStatTile>
      <VideoCardStatTile {...daysOldTileProps}>
        <p className="text-sm font-extrabold">{publishedDateText}</p>
        <p className="text-[10px] font-semibold text-slate-500">{daysOldText}</p>
      </VideoCardStatTile>
    </div>
  );
}
