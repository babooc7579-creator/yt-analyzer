export default function ScrapbookVideoFooterStats({ video }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-0.5">조회수 / 참여율</p>
      <p className="font-bold text-slate-800 text-sm">
        {video.view_count.toLocaleString()} <span className="text-xs text-rose-500 ml-1">({video.like_ratio}%)</span>
      </p>
    </div>
  );
}
