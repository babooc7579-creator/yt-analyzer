import VideoCardProductionButton from './VideoCardProductionButton';
import VideoCardScrapButton from './VideoCardScrapButton';

export default function VideoCardPrimaryActions({
  isProductionCandidate,
  isSaved,
  onPromoteToProduction,
  onToggleScrap,
  video,
  videoTitle,
}) {
  return (
    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
      <VideoCardProductionButton
        isProductionCandidate={isProductionCandidate}
        onPromoteToProduction={onPromoteToProduction}
        video={video}
        videoTitle={videoTitle}
      />
      <VideoCardScrapButton
        isSaved={isSaved}
        onToggleScrap={onToggleScrap}
        video={video}
        videoTitle={videoTitle}
      />
    </div>
  );
}
