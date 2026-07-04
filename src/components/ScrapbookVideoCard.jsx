import { getYouTubeVideoUrl } from '../utils/urls';
import ScrapbookVideoCardFooter from './ScrapbookVideoCardFooter';
import ScrapbookVideoThumbnail from './ScrapbookVideoThumbnail';

export default function ScrapbookVideoCard({
  video,
  onFetchComments,
  onRemoveScrap,
}) {
  const videoTitle = video.title || '이 영상';
  const videoUrl = getYouTubeVideoUrl(video.videoId);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all group bg-white flex flex-col">
      <ScrapbookVideoThumbnail video={video} videoTitle={videoTitle} />
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
