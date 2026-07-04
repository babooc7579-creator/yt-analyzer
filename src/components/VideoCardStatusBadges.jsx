export default function VideoCardStatusBadges({ isChecked, isProductionCandidate, isSaved }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      {isSaved && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700">소재 보관됨</span>}
      {isProductionCandidate && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">제작 후보</span>}
      {isChecked && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">AI 리메이크 선택</span>}
    </div>
  );
}
