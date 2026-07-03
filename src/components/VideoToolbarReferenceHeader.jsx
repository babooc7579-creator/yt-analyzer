import CopyUrlButton from './CopyUrlButton';

export default function VideoToolbarReferenceHeader({
  filteredCount,
  filteredVideoUrlList,
  totalCount,
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-extrabold text-slate-900">보관함 도구막대</p>
        <p className="text-[11px] text-slate-500">검색, 필터, 정렬, 보기 방식을 바꿔 제작 소재를 좁혀봅니다.</p>
      </div>
      <div className="flex flex-col gap-1 sm:items-end">
        <p className="text-[10px] font-semibold text-slate-500">현재 표시 {filteredCount}개 / 전체 {totalCount}개</p>
        <CopyUrlButton
          url={filteredVideoUrlList}
          label="영상 URL 목록 복사"
          copiedLabel="목록 복사 완료"
          disabled={!filteredVideoUrlList}
          ariaLabel={`현재 표시된 저장 영상 ${filteredCount}개 URL 목록 복사`}
          title="현재 검색/필터/정렬 조건으로 보이는 영상 제목과 YouTube URL 목록을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다."
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-extrabold text-slate-700 transition-colors hover:bg-slate-50 disabled:text-slate-300"
          iconClassName="h-3.5 w-3.5"
        />
      </div>
    </div>
  );
}
