import ScrapbookVideoFooterActions from './ScrapbookVideoFooterActions';
import ScrapbookVideoFooterStats from './ScrapbookVideoFooterStats';

export default function ScrapbookVideoCardFooter({
  onFetchComments,
  isProductionCandidate,
  onPromoteToProduction,
  onRemoveScrap,
  video,
  videoTitle,
  videoUrl,
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-end sm:justify-between">
      <ScrapbookVideoFooterStats video={video} />
      <ScrapbookVideoFooterActions
        onFetchComments={onFetchComments}
        isProductionCandidate={isProductionCandidate}
        onPromoteToProduction={onPromoteToProduction}
        onRemoveScrap={onRemoveScrap}
        video={video}
        videoTitle={videoTitle}
        videoUrl={videoUrl}
      />
    </div>
  );
}
