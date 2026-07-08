import { getVideoThumbnailAltText } from '../utils/videoCard';

export default function VideoListRowThumbnail({ video, videoTitle }) {
  const thumbnailAltText = getVideoThumbnailAltText({ videoTitle });

  return (
    <img
      src={video.thumbnail}
      alt={thumbnailAltText}
      className="w-36 h-20 object-cover rounded-xl shadow-sm border border-slate-200 shrink-0 bg-slate-100"
    />
  );
}
