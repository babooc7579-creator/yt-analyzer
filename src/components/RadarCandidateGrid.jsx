import RadarCandidateCard from './RadarCandidateCard';

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function RadarCandidateGrid({
  candidates,
  isVideoSaved,
  onMarkVideoStatus,
  onPromoteToProduction,
  onToggleScrap,
}) {
  const candidateList = toArray(candidates);

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
      {candidateList.map((video, index) => (
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
