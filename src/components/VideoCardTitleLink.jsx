import { getVideoTitleLinkAriaLabel } from '../utils/videoCard';

export default function VideoCardTitleLink({ videoTitle, videoUrl }) {
  const ariaLabel = getVideoTitleLinkAriaLabel({ videoTitle });

  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noreferrer"
      className="line-clamp-2 text-base font-extrabold leading-snug text-slate-900 hover:text-indigo-600"
      title={videoTitle}
      aria-label={ariaLabel}
    >
      {videoTitle}
    </a>
  );
}
