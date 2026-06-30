import { MessageSquareText, Trash2 } from 'lucide-react';

export default function ScrapbookVideoCard({
  video,
  onFetchComments,
  onRemoveScrap,
}) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all group bg-white flex flex-col">
      <div className="relative">
        <img src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`} alt="thumb" className="w-full aspect-video object-cover" />
        <div className="absolute top-2 left-2 flex gap-1">
          {video.isShorts && <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">Shorts</span>}
        </div>
        <div className="absolute bottom-2 right-2 flex gap-2">
          <span className="bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">{video.duration}</span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noreferrer" className="font-bold text-slate-800 line-clamp-2 text-sm hover:text-indigo-600 mb-2 leading-snug" title={video.title}>{video.title}</a>
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{video.channel_title}</span>
          </div>
        </div>
        <div className="flex justify-between items-end pt-3 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">조회수 / 참여율</p>
            <p className="font-bold text-slate-800 text-sm">{video.view_count.toLocaleString()} <span className="text-xs text-rose-500 ml-1">({video.like_ratio}%)</span></p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onFetchComments(video.videoId, video.title)} className="p-1.5 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors" title="댓글 Top 10 보기 - YouTube API로 댓글을 조회합니다" type="button">
              <MessageSquareText className="w-4 h-4" />
            </button>
            <button onClick={() => onRemoveScrap(video)} className="p-1.5 text-slate-400 bg-slate-50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="스크랩 해제" type="button">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
