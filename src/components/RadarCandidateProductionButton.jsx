import { Rocket } from 'lucide-react';

export default function RadarCandidateProductionButton({
  onPromoteToProduction,
  video,
  videoTitle,
}) {
  return (
    <button
      type="button"
      onClick={() => onPromoteToProduction(video)}
      className="inline-flex items-center justify-center gap-1 rounded-xl bg-indigo-500/15 px-3 py-2 text-[11px] font-extrabold text-indigo-100 ring-1 ring-indigo-400/20 hover:bg-indigo-500/20"
      title="스크랩북에 보관하고 Cloud 판단 기록에 제작 후보로 저장합니다. YouTube API를 새로 호출하지 않습니다."
      aria-label={`${videoTitle} 스크랩북에 보관하고 Cloud 판단 기록에 제작 후보로 저장, YouTube API 호출 없음`}
    >
      <Rocket className="h-3.5 w-3.5" /> 제작 후보로
    </button>
  );
}
