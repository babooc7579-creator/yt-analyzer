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
      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-[11px] font-extrabold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isSaved ? 'border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 disabled:hover:bg-yellow-100' : 'border-yellow-300 bg-white text-yellow-700 hover:bg-yellow-50 disabled:hover:bg-white'}`}
    >
      <Star className={`h-3.5 w-3.5 ${isSaved ? 'fill-yellow-800' : ''}`} />
      {buttonLabel}
    </button>
  );
}
