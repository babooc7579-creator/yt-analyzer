export default function TopCommentsModalVideoTitle({ videoTitle }) {
  return (
    <div className="p-4 bg-indigo-50/50 border-b border-indigo-100 text-sm font-medium text-indigo-900 line-clamp-1">
      원본 영상: {videoTitle}
    </div>
  );
}
