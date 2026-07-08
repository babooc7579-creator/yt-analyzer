import { getVideoCardCopyUrlButtonProps } from '../utils/videoCard';
import CopyUrlButton from './CopyUrlButton';
import VideoCardCommentButton from './VideoCardCommentButton';
import VideoCardMetaBadges from './VideoCardMetaBadges';

export default function VideoCardMetaActions({
  onFetchComments,
  video,
  videoTitle,
  videoUrl,
}) {
  const copyUrlButtonProps = getVideoCardCopyUrlButtonProps({
    videoTitle,
    videoUrl,
  });

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <VideoCardMetaBadges video={video} />
      <VideoCardCommentButton onFetchComments={onFetchComments} video={video} videoTitle={videoTitle} />
      <CopyUrlButton
        {...copyUrlButtonProps}
        className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-600 transition-colors hover:bg-slate-100 disabled:text-slate-300"
      />
    </div>
  );
}
