import { getRadarCandidateScorePanelViewProps } from '../utils/radarCandidates';

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function RadarCandidateScorePanel({ radarScore, reasons }) {
  const viewProps = getRadarCandidateScorePanelViewProps({ radarScore, reasons });
  const reasonList = toArray(viewProps.reasonList);

  return (
    <div className="mt-3 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-extrabold text-rose-100">{viewProps.titleText}</p>
        <p className="text-sm font-black text-white">{viewProps.scoreText}</p>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {reasonList.map((reason) => (
          <span key={reason} className="rounded-full border border-rose-300/20 bg-white/10 px-2 py-1 text-[10px] font-bold text-rose-50">
            {reason}
          </span>
        ))}
      </div>
    </div>
  );
}
