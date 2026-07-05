import { Clock, MessageSquareText } from 'lucide-react';

import { getVideoListRowMetaActionsViewProps } from '../utils/videoListRowMetaActionsProps';
import CopyUrlButton from './CopyUrlButton';

export default function VideoListRowMetaActions({ fetchTopComments, video, videoTitle, videoUrl }) {
  const {
    commentsButtonProps,
    copyUrlButtonProps,
    durationBadge,
    languageLabel,
  } = getVideoListRowMetaActionsViewProps({
    fetchTopComments,
    video,
    videoTitle,
    videoUrl,
  });

  return (
    <div className="flex flex-wrap items-center gap-2 mt-1">
      <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full border border-slate-200 font-semibold">
        {languageLabel}
      </span>
      {durationBadge.isShorts ? (
        <span className="text-[11px] bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-bold">{durationBadge.text}</span>
      ) : (
        <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
          <Clock className="w-3 h-3" /> {durationBadge.text}
        </span>
      )}
      <button {...commentsButtonProps}>
        <MessageSquareText className="w-3 h-3" /> 댓글 Top 10 보기
      </button>
      <CopyUrlButton {...copyUrlButtonProps} />
    </div>
  );
}
