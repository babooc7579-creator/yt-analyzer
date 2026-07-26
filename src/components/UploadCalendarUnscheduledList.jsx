import { CalendarPlus, PencilLine } from 'lucide-react';

import YouTubeThumbnailImage from './YouTubeThumbnailImage';

export default function UploadCalendarUnscheduledList({
  items = [],
  onOpenProductionCandidate,
  onOpenProductionCandidates,
  onOpenScriptBoard,
}) {
  if (!items.length) return null;

  return (
    <section className="border border-amber-400/30 bg-amber-400/5 p-4" aria-labelledby="upload-calendar-unscheduled-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold text-amber-300">다음 작업</p>
          <h3 id="upload-calendar-unscheduled-title" className="mt-1 text-base font-black text-white">
            날짜 미정 제작 후보 {items.length}개
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            아직 업로드 날짜가 없는 후보입니다. 대본을 이어서 쓰거나 후보함에서 목표 날짜를 정하세요.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenProductionCandidates}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-amber-300 px-4 text-xs font-black text-slate-950 hover:bg-amber-200"
          title="제작 후보함으로 이동해 날짜 미정 후보의 목표 업로드 날짜를 정합니다. 이동만으로 날짜를 저장하거나 YouTube API를 호출하지 않습니다."
          aria-label="제작 후보함에서 날짜 미정 후보 일정 정하기, 화면 이동이며 자동 저장 및 YouTube API 호출 없음"
        >
          <CalendarPlus className="h-4 w-4" /> 후보함에서 날짜 정하기
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {items.map((item) => (
          <article key={item.videoId} className="flex min-w-0 gap-3 border border-slate-800 bg-slate-950/70 p-3">
            {item.thumbnail ? (
              <YouTubeThumbnailImage
                src={item.thumbnail}
                videoId={item.videoId}
                preferredQuality="standard"
                alt=""
                className="h-16 w-24 shrink-0 object-cover"
              />
            ) : (
              <div className="flex h-16 w-24 shrink-0 items-center justify-center bg-slate-800 text-[10px] font-bold text-slate-600">
                영상 정보
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
                  {item.statusLabel}
                </span>
                {!item.sourceLoaded && (
                  <span className="border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-200">
                    영상 정보 미불러옴
                  </span>
                )}
              </div>
              <p className="mt-1.5 line-clamp-2 text-sm font-extrabold text-white">{item.title}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {typeof onOpenScriptBoard === 'function' && (
                  <button
                    type="button"
                    onClick={() => onOpenScriptBoard(item)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-300 hover:text-violet-200"
                    title="대본 보드를 열고 이 후보의 작업을 이어갑니다. 이동만으로 Cloud 데이터나 YouTube API 호출은 실행되지 않습니다."
                  >
                    <PencilLine className="h-3.5 w-3.5" /> 대본 이어쓰기
                  </button>
                )}
                {typeof onOpenProductionCandidate === 'function' && (
                  <button
                    type="button"
                    onClick={() => onOpenProductionCandidate(item)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200"
                    title="제작 후보함에서 이 항목을 찾아 목표 업로드 날짜를 정합니다. 이동만으로 날짜를 저장하지 않습니다."
                  >
                    <CalendarPlus className="h-3.5 w-3.5" /> 이 후보 날짜 정하기
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
