import { getVideoCardCandidateReasonsViewProps } from '../utils/videoCard';

export default function VideoCardCandidateReasons({ candidateReasons }) {
  const {
    description,
    isCandidate,
    title,
  } = getVideoCardCandidateReasonsViewProps({ candidateReasons });

  return (
    <div className={`mt-3 min-h-[58px] rounded-lg border px-3 py-2 ${isCandidate ? 'border-rose-100 bg-rose-50' : 'border-slate-200 bg-slate-50'}`}>
      <p className={`text-[10px] font-extrabold ${isCandidate ? 'text-rose-500' : 'text-slate-400'}`}>{title}</p>
      <p className={`mt-0.5 text-xs font-bold ${isCandidate ? 'text-rose-800' : 'text-slate-600'}`}>{description}</p>
    </div>
  );
}
