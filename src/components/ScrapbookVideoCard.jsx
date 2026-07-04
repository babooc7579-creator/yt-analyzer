import { getYouTubeVideoUrl } from '../utils/urls';
import ScrapbookVideoCardFooter from './ScrapbookVideoCardFooter';
import ScrapbookVideoInfo from './ScrapbookVideoInfo';
import ScrapbookVideoThumbnail from './ScrapbookVideoThumbnail';

export default function ScrapbookVideoCard({
  video,
  onFetchComments,
  onRemoveScrap,
}) {
  const videoTitle = video.title || '이 영상';
  const videoUrl = getYouTubeVideoUrl(video.videoId);

  const footerProps = {
    onFetchComments,
    onRemoveScrap,
    video,
    videoTitle,
    videoUrl,
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all group bg-white flex flex-col">
      <ScrapbookVideoThumbnail video={video} videoTitle={videoTitle} />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <ScrapbookVideoInfo video={video} videoUrl={videoUrl} />
        <ScrapbookVideoCardFooter {...footerProps} />
      </div>
    </div>
  );
}
