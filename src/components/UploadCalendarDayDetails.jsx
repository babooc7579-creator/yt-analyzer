import { ExternalLink, PencilLine } from 'lucide-react';

import { getYouTubeVideoUrl } from '../utils/urls';

export default function UploadCalendarDayDetails({ items, onOpenProductionCandidates, selectedDate }) {
  return (
    <section className="border border-slate-800 bg-slate-950/45 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-extrabold text-amber-300">선택한 날짜</p>
          <h3 className="mt-1 text-base font-black text-white">{selectedDate} · {items.length}개</h3>
        </div>
        <button type="button" onClick={onOpenProductionCandidates} className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-700 px-3 text-xs font-extrabold text-slate-200 hover:bg-slate-800"><PencilLine className="h-4 w-4" /> 일정 수정</button>
      </div>

      {items.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-2 lg:grid-cols-2">
          {items.map((item) => (
            <article key={`${item.date}-${item.videoId}`} className="flex min-w-0 gap-3 border border-slate-800 bg-slate-900 p-3">
              {item.thumbnail ? <img src={item.thumbnail} alt="" className="h-16 w-24 shrink-0 object-cover" /> : <div className="flex h-16 w-24 shrink-0 items-center justify-center bg-slate-800 text-[10px] font-bold text-slate-600">영상 정보</div>}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">{item.statusLabel}</span>
                  {!item.sourceLoaded && <span className="border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-200">영상 정보 미불러옴</span>}
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm font-extrabold text-white">{item.title}</p>
                <a href={getYouTubeVideoUrl(item.videoId)} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 hover:text-cyan-200"><ExternalLink className="h-3.5 w-3.5" /> 원본 열기</a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 border border-dashed border-slate-800 px-4 py-8 text-center text-sm text-slate-500">선택한 날짜에 등록된 일정이 없습니다.</p>
      )}
    </section>
  );
}
