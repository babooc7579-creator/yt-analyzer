import { CheckSquare, Square, Star } from 'lucide-react';
import { getVideoListTableRowViewProps } from '../utils/videoListTableRowProps';
import { getVideoListRowStatsViewProps } from '../utils/videoListRowStatsProps';
import { getVideoScrapActionCopy, getVideoSelectionActionCopy } from '../utils/videoActionButtonProps';
import VideoListRowCandidateAction from './VideoListRowCandidateAction';

export default function VideoMobileListItem(props) {
  const {
    candidateActionProps,
    contentCellProps,
    markerCellsProps,
    rowClassName,
    statsCellsProps,
  } = getVideoListTableRowViewProps(props);
  const stats = getVideoListRowStatsViewProps(statsCellsProps);
  const selectionCopy = getVideoSelectionActionCopy({
    isChecked: markerCellsProps.isChecked,
    videoTitle: contentCellProps.videoTitle,
  });
  const scrapCopy = getVideoScrapActionCopy({
    isSaved: markerCellsProps.isSaved,
    videoTitle: contentCellProps.videoTitle,
  });

  return (
    <article className={`rounded-xl p-4 shadow-sm ${rowClassName}`}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={markerCellsProps.onToggleCheck}
          disabled={markerCellsProps.checkDisabled}
          title={selectionCopy.title}
          aria-label={selectionCopy.ariaLabel}
          className="rounded-lg p-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {markerCellsProps.isChecked
            ? <CheckSquare className="h-6 w-6 text-indigo-600" />
            : <Square className="h-6 w-6 text-slate-400" />}
        </button>
        <div className="min-w-0 flex-1">
          <a
            href={contentCellProps.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="line-clamp-2 text-sm font-extrabold leading-snug text-slate-900 hover:text-indigo-700"
          >
            {contentCellProps.videoTitle}
          </a>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-white/80 px-2 py-2">
              <p className="text-[10px] font-bold text-slate-500">조회수</p>
              <p className="mt-0.5 text-xs font-extrabold text-slate-800">{stats.viewCountText}</p>
            </div>
            <div className="rounded-lg bg-white/80 px-2 py-2">
              <p className="text-[10px] font-bold text-slate-500">대박 지수</p>
              <p className="mt-0.5 text-xs font-extrabold text-indigo-700">{stats.multiplierText}</p>
            </div>
            <div className="rounded-lg bg-white/80 px-2 py-2">
              <p className="text-[10px] font-bold text-slate-500">게시일 · 경과</p>
              <p className="mt-0.5 text-[11px] font-extrabold text-slate-700">{stats.publishedAgeText}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={markerCellsProps.onToggleScrap}
              disabled={markerCellsProps.scrapDisabled}
              title={scrapCopy.title}
              aria-label={scrapCopy.ariaLabel}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-[11px] font-extrabold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Star className={`h-3.5 w-3.5 ${markerCellsProps.isSaved ? 'fill-yellow-400 text-yellow-500' : 'text-slate-400'}`} />
              {scrapCopy.buttonLabel}
            </button>
            <VideoListRowCandidateAction {...candidateActionProps} />
          </div>
        </div>
      </div>
    </article>
  );
}
