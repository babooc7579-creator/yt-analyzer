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
    <div className="flex justify-between items-end pt-3 border-t border-slate-100">
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
