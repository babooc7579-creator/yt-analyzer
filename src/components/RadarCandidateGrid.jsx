import RadarCandidateCard from './RadarCandidateCard';

export default function RadarCandidateGrid({
  candidates,
  isVideoSaved,
  onMarkVideoStatus,
  onPromoteToProduction,
  onToggleScrap,
}) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
      {candidates.map((video, index) => (
        <RadarCandidateCard
          key={video.videoId}
          index={index}
          isSaved={isVideoSaved(video.videoId)}
          video={video}
          onMarkVideoStatus={onMarkVideoStatus}
          onPromoteToProduction={onPromoteToProduction}
          onToggleScrap={onToggleScrap}
        />
      ))}
    </div>
  );
}
