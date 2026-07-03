import { RotateCcw } from 'lucide-react';
import { getYouTubeVideoUrl } from '../utils/urls';

function DecisionSummary({ summary }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
      <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2">
        <p className="text-[10px] font-extrabold text-emerald-100">봤음</p>
        <p className="mt-1 text-lg font-black text-white">{summary.reviewed}</p>
      </div>
      <div className="rounded-xl border border-slate-500/30 bg-slate-900/60 px-3 py-2">
        <p className="text-[10px] font-extrabold text-slate-200">나중에 보기</p>
        <p className="mt-1 text-lg font-black text-white">{summary.later}</p>
      </div>
      <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-3 py-2">
        <p className="text-[10px] font-extrabold text-indigo-100">제작 후보</p>
        <p className="mt-1 text-lg font-black text-white">{summary.production}</p>
      </div>
      <div className="rounded-xl border border-slate-500/30 bg-slate-950/70 px-3 py-2">
        <p className="text-[10px] font-extrabold text-slate-300">제외</p>
        <p className="mt-1 text-lg font-black text-white">{summary.excluded}</p>
      </div>
    </div>
  );
}

function DecisionLists({
  groups,
  loadedDecisionCount,
  onRestoreVideo,
}) {
  if (loadedDecisionCount === 0) return null;

  return (
    <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-950/50 p-3">
      <div>
        <p className="text-xs font-extrabold text-white">처리 기록</p>
        <p className="mt-0.5 text-[10px] text-slate-400">현재 불러온 영상에서 이미 판단한 항목입니다. 실수한 항목은 다시 레이더로 돌릴 수 있습니다.</p>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
        {groups.map((group) => (
          <div key={group.key} className="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5">
            <p className="text-[10px] font-extrabold text-slate-300">{group.label}</p>
            {group.videos.length === 0 ? (
              <p className="mt-2 text-[10px] text-slate-500">아직 없음</p>
            ) : (
              <div className="mt-2 space-y-1.5">
                {group.videos.slice(0, 3).map((video) => {
                  const videoUrl = getYouTubeVideoUrl(video.videoId);
                  return (
                    <div key={`${group.key}-${video.videoId}`} className="rounded-lg bg-slate-950/70 p-1.5">
                      <a
                        href={videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-[10px] font-bold text-slate-200 hover:text-white"
                        title={video.title}
                        aria-label={`${video.title} YouTube 원본 영상 열기`}
                      >
                        {video.title}
                      </a>
                      <button
                        type="button"
                        onClick={() => onRestoreVideo(video.videoId)}
                        className="mt-1 inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-200 hover:text-white"
                        title="이 영상을 오늘 레이더 후보로 다시 표시"
                        aria-label={`${video.title} 레이더로 되돌리기`}
                      >
                        <RotateCcw className="h-3 w-3" /> 레이더로 되돌리기
                      </button>
                    </div>
                  );
                })}
                {group.videos.length > 3 && (
                  <p className="text-[10px] font-bold text-slate-500">외 {group.videos.length - 3}개</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RadarDecisionPanel({
  decisionGroups,
  decisionSummary,
  loadedDecisionCount,
  onRestoreVideo,
}) {
  return (
    <>
      <DecisionSummary summary={decisionSummary} />
      <DecisionLists
        groups={decisionGroups}
        loadedDecisionCount={loadedDecisionCount}
        onRestoreVideo={onRestoreVideo}
      />
    </>
  );
}
