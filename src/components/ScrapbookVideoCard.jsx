import { getYouTubeVideoUrl } from '../utils/urls';
import ScrapbookVideoCardFooter from './ScrapbookVideoCardFooter';

export default function ScrapbookVideoCard({
  video,
  onFetchComments,
  onRemoveScrap,
}) {
  const videoTitle = video.title || '이 영상';
  const videoUrl = getYouTubeVideoUrl(video.videoId);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all group bg-white flex flex-col">
      <div className="relative">
        <img src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`} alt={`${videoTitle} 썸네일`} className="w-full aspect-video object-cover" />
        <div className="absolute top-2 left-2 flex gap-1">
          {video.isShorts && <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">Shorts</span>}
        </div>
        <div className="absolute bottom-2 right-2 flex gap-2">
          <span className="bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">{video.duration}</span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <a href={videoUrl} target="_blank" rel="noreferrer" className="font-bold text-slate-800 line-clamp-2 text-sm hover:text-indigo-600 mb-2 leading-snug" title={video.title} aria-label={`${video.title} YouTube 원본 영상 열기`}>{video.title}</a>
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{video.channel_title}</span>
          </div>
        </div>
        <ScrapbookVideoCardFooter
          onFetchComments={onFetchComments}
          onRemoveScrap={onRemoveScrap}
          video={video}
          videoTitle={videoTitle}
          videoUrl={videoUrl}
        />
      </div>
    </div>
  );
}
