import { getScrapbookVideoThumbnailViewProps } from '../utils/scrapbook';

export default function ScrapbookVideoThumbnail({ video, videoTitle }) {
  const viewProps = getScrapbookVideoThumbnailViewProps({ video, videoTitle });

  return (
    <div className="relative">
      <img
        src={viewProps.imageProps.src}
        alt={viewProps.imageProps.alt}
        className="w-full aspect-video object-cover"
      />
      <div className="absolute top-2 left-2 flex gap-1">
        {viewProps.showShortsLabel && <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">{viewProps.shortsLabel}</span>}
      </div>
      <div className="absolute bottom-2 right-2 flex gap-2">
        <span className="bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">{viewProps.durationText}</span>
      </div>
    </div>
  );
}
