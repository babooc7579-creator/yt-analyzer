import { getRadarCandidateMetricsViewProps } from '../utils/radarCandidates';

export default function RadarCandidateMetrics({ video }) {
  const { items } = getRadarCandidateMetricsViewProps(video);

  return (
    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl bg-slate-900 px-2 py-2">
          <p className="text-[9px] font-bold text-slate-500">{item.label}</p>
          <p className="text-sm font-extrabold text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
