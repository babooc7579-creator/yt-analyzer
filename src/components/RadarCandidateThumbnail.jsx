import { getRadarCandidateThumbnailViewProps } from '../utils/radarCandidates';

export default function RadarCandidateThumbnail({ index, priorityLabel, video, videoTitle }) {
  const viewProps = getRadarCandidateThumbnailViewProps({
    index,
    priorityLabel,
    video,
    videoTitle,
  });

  return (
    <div className="relative">
      <img src={viewProps.imageProps.src} alt={viewProps.imageProps.alt} className="aspect-video w-full object-cover" />
      <span className="absolute left-2 top-2 rounded-full bg-black/80 px-2 py-1 text-[10px] font-extrabold text-white">{viewProps.rankText}</span>
      <span className="absolute right-2 top-2 rounded-full bg-rose-600 px-2 py-1 text-[10px] font-extrabold text-white">{viewProps.priorityLabel}</span>
    </div>
  );
}
