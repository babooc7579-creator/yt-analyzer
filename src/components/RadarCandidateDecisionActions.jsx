import RadarCandidateProductionButton from './RadarCandidateProductionButton';
import RadarCandidateScrapButton from './RadarCandidateScrapButton';
import RadarCandidateStatusActions from './RadarCandidateStatusActions';

export default function RadarCandidateDecisionActions({
  isSaved,
  onMarkVideoStatus,
  onPromoteToProduction,
  onToggleScrap,
  video,
  videoTitle,
}) {
  return (
    <>
      <p className="mt-3 text-[10px] font-bold text-slate-400">2. 판단 결과는 Cloud 판단 기록에 저장되고 오늘 레이더에서 숨겨집니다. YouTube API를 새로 호출하지 않습니다.</p>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <RadarCandidateScrapButton
          isSaved={isSaved}
          onToggleScrap={onToggleScrap}
          video={video}
          videoTitle={videoTitle}
        />
        <RadarCandidateProductionButton
          onPromoteToProduction={onPromoteToProduction}
          video={video}
          videoTitle={videoTitle}
        />
        <RadarCandidateStatusActions
          onMarkVideoStatus={onMarkVideoStatus}
          video={video}
          videoTitle={videoTitle}
        />
      </div>
    </>
  );
}
