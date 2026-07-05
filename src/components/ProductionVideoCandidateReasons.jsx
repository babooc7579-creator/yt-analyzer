import { Lightbulb } from 'lucide-react';

export default function ProductionVideoCandidateReasons({
  priorityLabel,
  radarScore,
  reasons,
}) {
  return (
    <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-700">
          <Lightbulb className="h-3 w-3" /> 후보 근거
        </p>
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-indigo-700">
          {priorityLabel} · {radarScore}점
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {reasons.map((reason) => (
          <span
            key={reason}
            className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-600"
          >
            {reason}
          </span>
        ))}
      </div>
    </div>
  );
}
