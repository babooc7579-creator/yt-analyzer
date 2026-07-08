import { getScrapbookVideoFooterStatsViewProps } from '../utils/scrapbook';

export default function ScrapbookVideoFooterStats({ video }) {
  const viewProps = getScrapbookVideoFooterStatsViewProps(video);

  return (
    <div>
      <p className="text-xs text-slate-500 mb-0.5">{viewProps.label}</p>
      <p className="font-bold text-slate-800 text-sm">
        {viewProps.viewCountText} <span className="text-xs text-rose-500 ml-1">{viewProps.likeRatioText}</span>
      </p>
    </div>
  );
}
