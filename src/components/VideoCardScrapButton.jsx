import { Star } from 'lucide-react';
import { getVideoScrapButtonActionProps } from '../utils/videoActionButtonProps';

export default function VideoCardScrapButton({ isSaved, onToggleScrap, video, videoTitle }) {
  const {
    ariaLabel,
    buttonLabel,
    disabled,
    onClick,
    title,
  } = getVideoScrapButtonActionProps({
    isSaved,
    onToggleScrap,
    video,
    videoTitle,
  });

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-extrabold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isSaved ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 disabled:hover:bg-yellow-100' : 'bg-yellow-500 text-white hover:bg-yellow-600 disabled:hover:bg-yellow-500'}`}
    >
      <Star className={`h-3.5 w-3.5 ${isSaved ? 'fill-yellow-800' : ''}`} />
      {buttonLabel}
    </button>
  );
}
