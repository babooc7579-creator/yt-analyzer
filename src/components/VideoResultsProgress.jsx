export default function VideoResultsProgress({
  displayedCount,
  onShowMore,
  pageSize,
  totalCount,
}) {
  if (totalCount <= pageSize) return null;

  const remainingCount = Math.max(0, totalCount - displayedCount);
  const nextCount = Math.min(pageSize, remainingCount);

  return (
    <div className="border-t border-slate-200 bg-white px-4 py-4 text-center">
      <p className="text-xs font-bold text-slate-600">
        검색 결과 {totalCount.toLocaleString()}개 중 {displayedCount.toLocaleString()}개 표시 중
      </p>
      {remainingCount > 0 ? (
        <>
          <button
            type="button"
            onClick={onShowMore}
            className="mt-2 w-full rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-extrabold text-indigo-700 hover:border-indigo-400 hover:bg-indigo-100 sm:w-auto"
            title="다음 영상을 화면에만 더 표시합니다. Azure DB 조회·저장이나 YouTube API 호출은 실행하지 않습니다."
            aria-label={`영상 ${nextCount}개 더 보기, 현재 ${displayedCount}개 표시 중, 전체 ${totalCount}개, 화면 표시만 변경`}
          >
            영상 {nextCount}개 더 보기 ({displayedCount.toLocaleString()}/{totalCount.toLocaleString()})
          </button>
          <p className="mt-2 text-[11px] font-semibold text-slate-500">
            화면 표시만 늘립니다. Azure DB 재조회·저장이나 YouTube API 호출은 없습니다.
          </p>
        </>
      ) : (
        <p className="mt-1 text-[11px] font-semibold text-emerald-700">검색 결과를 모두 표시했습니다.</p>
      )}
    </div>
  );
}
