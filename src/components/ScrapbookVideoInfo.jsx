import { getScrapbookVideoInfoViewProps } from '../utils/scrapbook';

export default function ScrapbookVideoInfo({ video, videoUrl }) {
  const viewProps = getScrapbookVideoInfoViewProps({ video, videoUrl });

  return (
    <div>
      <a
        href={viewProps.titleLinkProps.href}
        target="_blank"
        rel="noreferrer"
        className="font-bold text-slate-800 line-clamp-2 text-sm hover:text-indigo-600 mb-2 leading-snug"
        title={viewProps.titleLinkProps.title}
        aria-label={viewProps.titleLinkProps['aria-label']}
      >
        {viewProps.title}
      </a>
      <div className="flex flex-wrap gap-1 mb-3">
        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{viewProps.channelTitle}</span>
      </div>
    </div>
  );
}
