import { CalendarPlus, ExternalLink, ListTodo, PencilLine } from 'lucide-react';

import { getYouTubeVideoUrl } from '../utils/urls';
import YouTubeThumbnailImage from './YouTubeThumbnailImage';

export default function UploadCalendarDayDetails({
  focusedVideoId = '',
  items,
  onOpenProductionCandidate,
  onOpenProductionCandidates,
  onOpenScriptBoard,
  selectedDate,
}) {
  return (
    <section className="border border-slate-800 bg-slate-950/45 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-extrabold text-amber-300">선택한 날짜</p>
          <h3 className="mt-1 text-base font-black text-white">{selectedDate} · {items.length}개</h3>
        </div>
        <button
          type="button"
          onClick={onOpenProductionCandidates}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-700 px-3 text-xs font-extrabold text-slate-200 hover:bg-slate-800"
          title="제작 후보함으로 이동해 일정을 수정합니다. 이동만으로 온라인 저장소(Azure DB) 데이터나 YouTube API 호출은 실행되지 않습니다."
          aria-label="제작 후보함에서 일정 수정, 화면 이동이며 온라인 저장소(Azure DB) 데이터 변경 및 YouTube API 호출 없음"
        >
          <PencilLine className="h-4 w-4" /> 일정 수정
        </button>
      </div>

      {items.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-2 lg:grid-cols-2">
          {items.map((item) => (
            <article
              key={`${item.date}-${item.videoId}`}
              className={`flex min-w-0 gap-3 border bg-slate-900 p-3 ${
                item.videoId === focusedVideoId ? 'border-amber-300 ring-1 ring-amber-300/30' : 'border-slate-800'
              }`}
            >
              {item.thumbnail ? (
                <YouTubeThumbnailImage
                  src={item.thumbnail}
                  videoId={item.videoId}
                  preferredQuality="standard"
                  alt=""
                  className="h-16 w-24 shrink-0 object-cover"
                />
              ) : <div className="flex h-16 w-24 shrink-0 items-center justify-center bg-slate-800 text-[10px] font-bold text-slate-600">영상 정보</div>}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">{item.statusLabel}</span>
                  {item.videoId === focusedVideoId && <span className="bg-amber-300 px-1.5 py-0.5 text-[10px] font-black text-slate-950">이어서 작업</span>}
                  {!item.sourceLoaded && <span className="border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-200">영상 정보 미불러옴</span>}
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm font-extrabold text-white">{item.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {typeof onOpenScriptBoard === 'function' && (
                    <button
                      type="button"
                      onClick={() => onOpenScriptBoard(item)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-300 hover:text-violet-200"
                      title="대본 작업실을 열고 이 영상의 제목과 통합 작업 메모를 이어서 작성합니다. 이동만으로 온라인 저장소(Azure DB) 데이터나 YouTube API 호출은 실행되지 않습니다."
                      aria-label="이 영상의 대본 작업실 열기, 화면 이동이며 온라인 저장소(Azure DB) 데이터 변경 및 YouTube API 호출 없음"
                    >
                      <PencilLine className="h-3.5 w-3.5" /> 대본 작업실 열기
                    </button>
                  )}
                  {typeof onOpenProductionCandidate === 'function' && (
                    <button
                      type="button"
                      onClick={() => onOpenProductionCandidate(item)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200"
                      title="제작 후보함을 열고 이 항목의 제목으로 화면 검색합니다. 온라인 저장소(Azure DB) 데이터는 바꾸지 않습니다."
                    >
                      <ListTodo className="h-3.5 w-3.5" /> 후보함에서 찾기
                    </button>
                  )}
                  <a href={getYouTubeVideoUrl(item.videoId)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 hover:text-cyan-200"><ExternalLink className="h-3.5 w-3.5" /> 원본 열기</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-4 border border-dashed border-slate-800 px-4 py-8 text-center">
          <p className="text-sm font-bold text-slate-400">선택한 날짜에 등록된 일정이 없습니다.</p>
          <p className="mt-1 text-xs text-slate-500">제작 후보함에서 후보를 고르고 목표 업로드 날짜를 지정하세요.</p>
          {typeof onOpenProductionCandidates === 'function' && (
            <button
              type="button"
              onClick={onOpenProductionCandidates}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-amber-300 px-4 text-xs font-black text-slate-950 hover:bg-amber-200"
              title="제작 후보함으로 이동해 선택한 날짜를 목표 업로드 날짜로 지정합니다. 이동만으로 날짜를 저장하거나 YouTube API를 호출하지 않습니다."
              aria-label="제작 후보함에서 날짜 정하기, 화면 이동이며 자동 날짜 저장 및 YouTube API 호출 없음"
            >
              <CalendarPlus className="h-4 w-4" /> 제작 후보에서 날짜 정하기
            </button>
          )}
        </div>
      )}
    </section>
  );
}
