export default function VideoToolbarSelectFilters({
  lengthFilter,
  setLengthFilter,
  setViewFilter,
  viewFilter,
}) {
  return (
    <>
      <select
        value={viewFilter}
        onChange={(e) => setViewFilter(Number(e.target.value))}
        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer text-slate-700 font-medium"
        title="불러온 저장 영상의 조회수 조건 필터"
        aria-label="조회수 조건 필터"
      >
        <option value={0}>조회수 전체</option>
        <option value={100000}>10만 이상</option>
        <option value={500000}>50만 이상</option>
        <option value={1000000}>100만 이상</option>
      </select>

      <select
        value={lengthFilter}
        onChange={(e) => setLengthFilter(e.target.value)}
        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer text-slate-700 font-medium"
        title="쇼츠/롱폼 길이 필터"
        aria-label="영상 길이 필터"
      >
        <option value="all">길이 전체</option>
        <option value="shorts">쇼츠만</option>
        <option value="long">롱폼만</option>
      </select>
    </>
  );
}
