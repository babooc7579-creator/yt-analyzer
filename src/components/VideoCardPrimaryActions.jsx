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
    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
      <VideoCardScrapButton
        isSaved={isSaved}
        onToggleScrap={onToggleScrap}
        video={video}
        videoTitle={videoTitle}
      />
      <VideoCardProductionButton
        isProductionCandidate={isProductionCandidate}
        onPromoteToProduction={onPromoteToProduction}
        video={video}
        videoTitle={videoTitle}
      />
    </div>
  );
}
