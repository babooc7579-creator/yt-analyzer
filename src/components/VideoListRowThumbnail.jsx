export default function VideoListRowThumbnail({ video, videoTitle }) {
  return (
    <img
      src={video.thumbnail}
      alt={`${videoTitle} 썸네일`}
      className="w-36 h-20 object-cover rounded-xl shadow-sm border border-slate-200 shrink-0 bg-slate-100"
    />
  );
}
