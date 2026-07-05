const toArray = (items) => (Array.isArray(items) ? items : []);

export default function VideoCardCandidateReasons({ candidateReasons }) {
  const reasonList = toArray(candidateReasons);

  if (reasonList.length === 0) return null;

  return (
    <div className="mt-3 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2">
      <p className="text-[10px] font-extrabold text-rose-500">후보 이유</p>
      <p className="mt-0.5 text-xs font-bold text-rose-800">{reasonList.join(' · ')}</p>
    </div>
  );
}
