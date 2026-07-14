import { getVideoThumbnailAltText } from '../utils/videoCard';
import YouTubeThumbnailImage from './YouTubeThumbnailImage';

export default function VideoListRowThumbnail({ video, videoTitle }) {
  const thumbnailAltText = getVideoThumbnailAltText({ videoTitle });

  return (
    <YouTubeThumbnailImage
      src={video.thumbnail}
      videoId={video.videoId}
      preferredQuality="standard"
      alt={thumbnailAltText}
      className="w-36 h-20 object-cover rounded-xl shadow-sm border border-slate-200 shrink-0 bg-slate-100"
    />
  );
}
