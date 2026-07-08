import { CheckSquare, Square, Star } from 'lucide-react';
import {
  getVideoScrapActionCopy,
  getVideoSelectionActionCopy,
} from '../utils/videoActionButtonProps';

export default function VideoCardThumbnailActions({
  isChecked,
  isSaved,
  onToggleCheck,
  onToggleScrap,
  video,
  videoTitle,
}) {
  const {
    ariaLabel: scrapAriaLabel,
    thumbnailLabel,
    title: scrapTitle,
  } = getVideoScrapActionCopy({
    isSaved,
    videoTitle,
  });
  const {
    ariaLabel: selectionAriaLabel,
    title: selectionTitle,
  } = getVideoSelectionActionCopy({
    isChecked,
    videoTitle,
  });

  return (
    <div className="absolute right-3 top-3 flex gap-2">
      <button
        type="button"
        onClick={() => onToggleCheck(video.videoId)}
        title={selectionTitle}
        aria-label={selectionAriaLabel}
        className="rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-indigo-50"
      >
        {isChecked ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 text-slate-400 hover:text-indigo-500" />}
      </button>
      <button
        type="button"
        onClick={() => onToggleScrap(video)}
        title={scrapTitle}
        aria-label={scrapAriaLabel}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-extrabold shadow-sm transition-colors ${isSaved ? 'bg-yellow-400 text-yellow-950 hover:bg-yellow-300' : 'bg-white/90 text-slate-600 hover:bg-yellow-50 hover:text-yellow-700'}`}
      >
        <Star className={`w-4 h-4 ${isSaved ? 'fill-yellow-950 text-yellow-950' : 'text-slate-400 group-hover:text-yellow-500'}`} />
        {thumbnailLabel}
      </button>
    </div>
  );
}
