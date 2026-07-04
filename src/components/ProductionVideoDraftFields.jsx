export default function ProductionVideoDraftFields({ onUpdateDraft, record, video, videoTitle }) {
  return (
    <>
      <label className="block">
        <span className="text-[10px] font-extrabold text-slate-500">내가 만들 제목</span>
        <input
          type="text"
          value={record.draftTitle || ''}
          onChange={(event) => onUpdateDraft(video.videoId, { draftTitle: event.target.value })}
          placeholder="내 채널에 맞게 바꿀 제목 초안"
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-200"
          aria-label={`${videoTitle} 내가 만들 제목 입력`}
        />
      </label>
      <label className="block">
        <span className="text-[10px] font-extrabold text-slate-500">메모</span>
        <textarea
          value={record.note || ''}
          onChange={(event) => onUpdateDraft(video.videoId, { note: event.target.value })}
          placeholder="훅 포인트, 참고할 장면, 만들 방향"
          rows={2}
          className="mt-1 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
          aria-label={`${videoTitle} 제작 메모 입력`}
        />
      </label>
      <label className="block">
        <span className="text-[10px] font-extrabold text-slate-500">업로드 예정일</span>
        <input
          type="date"
          value={record.targetPublishDate || ''}
          onChange={(event) => onUpdateDraft(video.videoId, { targetPublishDate: event.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
          title="업로드 예정일 선택"
          aria-label={`${videoTitle} 업로드 예정일 선택`}
        />
      </label>
    </>
  );
}
