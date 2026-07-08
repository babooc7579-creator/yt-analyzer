import { getVideoCardCandidateReasonsViewProps } from '../utils/videoCard';

export default function VideoCardCandidateReasons({ candidateReasons }) {
  const {
    joinedReasons,
    shouldShow,
    title,
  } = getVideoCardCandidateReasonsViewProps({ candidateReasons });

  if (!shouldShow) return null;

  return (
    <div className="mt-3 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2">
      <p className="text-[10px] font-extrabold text-rose-500">{title}</p>
      <p className="mt-0.5 text-xs font-bold text-rose-800">{joinedReasons}</p>
    </div>
  );
}
