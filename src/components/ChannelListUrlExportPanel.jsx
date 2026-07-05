import CopyUrlButton from './CopyUrlButton';

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function ChannelListUrlExportPanel({
  selectedCategory,
  visibleChannels,
  visibleChannelUrlList,
}) {
  const visibleChannelList = toArray(visibleChannels);

  if (visibleChannelList.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-extrabold text-slate-700">현재 목록 {visibleChannelList.length}개</p>
          <p className="mt-0.5 text-[10px] leading-snug text-slate-500">
            화면에 보이는 채널명과 YouTube URL만 복사합니다. 저장이나 수집은 실행하지 않습니다.
          </p>
        </div>
        <CopyUrlButton
          url={visibleChannelUrlList}
          label="채널 URL 목록 복사"
          copiedLabel="목록 복사 완료"
          disabled={!visibleChannelUrlList}
          ariaLabel={`${selectedCategory} 채널 ${visibleChannelList.length}개 URL 목록 복사`}
          title="현재 카테고리에 보이는 채널명과 YouTube URL 목록을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다."
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-extrabold text-slate-700 transition-colors hover:bg-slate-100 disabled:text-slate-300"
          iconClassName="h-3.5 w-3.5"
        />
      </div>
    </div>
  );
}
