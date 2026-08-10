import { getVideoCardCandidateReasonsViewProps } from '../utils/videoCard';

export default function VideoCardCandidateReasons({ candidateReasons }) {
  const {
    description,
    isCandidate,
    shouldShow,
    title,
  } = getVideoCardCandidateReasonsViewProps({ candidateReasons });

  if (!shouldShow) return null;

  return (
    <div className={`mt-3 flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-lg border px-3 py-2 ${isCandidate ? 'border-rose-100 bg-rose-50' : 'border-slate-200 bg-slate-50'}`}>
      <p className={`shrink-0 text-[10px] font-extrabold ${isCandidate ? 'text-rose-500' : 'text-slate-400'}`}>{title}</p>
      <p className={`text-xs font-bold ${isCandidate ? 'text-rose-800' : 'text-slate-600'}`}>{description}</p>
    </div>
  );
}
