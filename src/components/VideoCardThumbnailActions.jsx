import { CheckSquare, Square } from 'lucide-react';
import { getVideoSelectionActionCopy } from '../utils/videoActionButtonProps';

export default function VideoCardThumbnailActions({
  isChecked,
  onToggleCheck,
  video,
  videoTitle,
}) {
  const {
    ariaLabel: selectionAriaLabel,
    title: selectionTitle,
  } = getVideoSelectionActionCopy({
    isChecked,
    videoTitle,
  });

  return (
    <div className="absolute right-3 top-3">
      <button
        type="button"
        onClick={() => onToggleCheck(video.videoId)}
        title={selectionTitle}
        aria-label={selectionAriaLabel}
        className="rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-indigo-50"
      >
        {isChecked ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 text-slate-400 hover:text-indigo-500" />}
      </button>
    </div>
  );
}
