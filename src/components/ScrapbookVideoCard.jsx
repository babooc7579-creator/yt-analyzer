import { getScrapbookVideoCardViewProps } from '../utils/scrapbook';
import ScrapbookVideoCardFooter from './ScrapbookVideoCardFooter';
import ScrapbookVideoInfo from './ScrapbookVideoInfo';
import ScrapbookVideoThumbnail from './ScrapbookVideoThumbnail';

export default function ScrapbookVideoCard({
  video,
  onFetchComments,
  isProductionCandidate,
  onOpenProductionCandidates,
  onPromoteToProduction,
  onRemoveScrap,
}) {
  const viewProps = getScrapbookVideoCardViewProps(video);

  const footerProps = {
    onFetchComments,
    isProductionCandidate,
    onOpenProductionCandidates,
    onPromoteToProduction,
    onRemoveScrap,
    video,
    videoTitle: viewProps.videoTitle,
    videoUrl: viewProps.videoUrl,
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all group bg-white flex flex-col">
      <ScrapbookVideoThumbnail video={video} videoTitle={viewProps.videoTitle} />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <ScrapbookVideoInfo video={video} videoUrl={viewProps.videoUrl} />
        <ScrapbookVideoCardFooter {...footerProps} />
      </div>
    </div>
  );
}
