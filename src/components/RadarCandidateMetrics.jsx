export default function RadarCandidateMetrics({ video }) {
  return (
    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
      <div className="rounded-xl bg-slate-900 px-2 py-2">
        <p className="text-[9px] font-bold text-slate-500">대박 지수</p>
        <p className="text-sm font-extrabold text-white">{Number(video.multiplier || 0).toFixed(1)}x</p>
      </div>
      <div className="rounded-xl bg-slate-900 px-2 py-2">
        <p className="text-[9px] font-bold text-slate-500">경과</p>
        <p className="text-sm font-extrabold text-white">{video.daysOld}일</p>
      </div>
      <div className="rounded-xl bg-slate-900 px-2 py-2">
        <p className="text-[9px] font-bold text-slate-500">참여율</p>
        <p className="text-sm font-extrabold text-white">{video.like_ratio}%</p>
      </div>
    </div>
  );
}
