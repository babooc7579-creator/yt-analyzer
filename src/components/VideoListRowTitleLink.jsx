import { getVideoTitleLinkAriaLabel } from '../utils/videoCard';

export default function VideoListRowTitleLink({ videoTitle, videoUrl }) {
  const ariaLabel = getVideoTitleLinkAriaLabel({ videoTitle });

  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noreferrer"
      className="text-base font-extrabold text-slate-900 hover:text-indigo-600 line-clamp-2 leading-snug mb-2"
      title={videoTitle}
      aria-label={ariaLabel}
    >
      {videoTitle}
    </a>
  );
}
