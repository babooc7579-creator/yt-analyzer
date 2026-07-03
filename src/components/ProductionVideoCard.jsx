import { AlertCircle, CheckCircle2, Clock, ExternalLink, Loader2, Play, Save } from 'lucide-react';
import { PRODUCTION_STATUS } from '../constants/status';
import { getYouTubeVideoUrl } from '../utils/urls';
import CopyUrlButton from './CopyUrlButton';
import ProductionVideoMetaBadges from './ProductionVideoMetaBadges';

const getTodayDate = () => new Date().toISOString().slice(0, 10);

export default function ProductionVideoCard({
  columnId,
  isDirty,
  moveState,
  onMove,
  onSave,
  onUpdateDraft,
  record,
  saveState,
  scheduleSignal,
  video,
}) {
  const videoTitle = video.title || '제목 없는 영상';
  const videoUrl = getYouTubeVideoUrl(video.videoId);
  const isSaving = saveState === 'saving';
  const isMoving = moveState === 'saving';

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <img src={video.thumbnail || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`} alt={`${videoTitle} 썸네일`} className="aspect-video w-full object-cover bg-slate-100" />
      <div className="p-3">
        <a href={videoUrl} target="_blank" rel="noreferrer" className="line-clamp-2 text-sm font-extrabold leading-snug text-slate-900 hover:text-indigo-600" title={videoTitle} aria-label={`${videoTitle} YouTube 원본 영상 열기`}>
          {videoTitle}
        </a>
        <ProductionVideoMetaBadges columnId={columnId} scheduleSignal={scheduleSignal} video={video} />

        <div className="mt-3 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
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
          <button
            type="button"
            onClick={() => onSave(video.videoId)}
            disabled={!isDirty || isSaving}
            className={`inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold transition-colors ${isDirty && !isSaving ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            title={isDirty ? '제목, 메모, 업로드 예정일을 Cloud 판단 기록에 저장' : 'Cloud에 저장된 상태'}
            aria-label={`${videoTitle} 제작 메모 저장`}
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {isSaving ? '저장 중...' : isDirty ? '변경 내용 저장' : '저장됨'}
          </button>
          {saveState === 'saved' && (
            <p className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <CheckCircle2 className="h-3 w-3" /> 클라우드에 저장됐습니다.
            </p>
          )}
          {saveState === 'error' && (
            <p className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
              <AlertCircle className="h-3 w-3" /> 저장 실패. 다시 저장해 주세요.
            </p>
          )}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2">
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-[10px] font-bold leading-relaxed text-slate-500">
            아래 상태 버튼은 이 영상의 제작 진행 상태를 Cloud 판단 기록에 저장합니다. YouTube API를 새로 호출하지 않습니다.
          </p>
          {columnId !== PRODUCTION_STATUS.CANDIDATE && (
            <button
              type="button"
              onClick={() => onMove(video.videoId, PRODUCTION_STATUS.CANDIDATE)}
              disabled={isMoving}
              className={`rounded-lg px-3 py-2 text-[11px] font-extrabold ${isMoving ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
              title="제작 상태를 후보로 되돌려 저장"
              aria-label={`${videoTitle} 제작 후보로 이동`}
            >
              {isMoving ? '이동 중...' : '제작 후보로'}
            </button>
          )}
          {columnId !== PRODUCTION_STATUS.ACTIVE && (
            <button
              type="button"
              onClick={() => onMove(video.videoId, PRODUCTION_STATUS.ACTIVE)}
              disabled={isMoving}
              className={`inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold ${isMoving ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
              title="제작 중 상태로 저장"
              aria-label={`${videoTitle} 제작 중으로 이동`}
            >
              {isMoving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Clock className="h-3.5 w-3.5" />} {isMoving ? '이동 중...' : '제작 중으로'}
            </button>
          )}
          {columnId !== PRODUCTION_STATUS.DONE && (
            <button
              type="button"
              onClick={() => onMove(video.videoId, PRODUCTION_STATUS.DONE, { uploadedAt: record.uploadedAt || getTodayDate() })}
              disabled={isMoving}
              className={`inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold ${isMoving ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
              title="업로드 완료 상태로 저장하고 완료일을 기록"
              aria-label={`${videoTitle} 업로드 완료로 이동`}
            >
              {isMoving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />} {isMoving ? '이동 중...' : '업로드 완료'}
            </button>
          )}
          {moveState === 'error' && (
            <p className="inline-flex items-center justify-center gap-1 text-[10px] font-bold text-red-600">
              <AlertCircle className="h-3 w-3" /> 상태 저장 실패. 다시 눌러 주세요.
            </p>
          )}
          {columnId === PRODUCTION_STATUS.DONE && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-[11px] font-bold text-slate-600">
              업로드 완료일 {record.uploadedAt || '기록 없음'}
            </div>
          )}
          <CopyUrlButton
            url={videoUrl}
            label="URL 복사"
            copiedLabel="복사 완료"
            ariaLabel={`${videoTitle} YouTube 원본 URL 복사`}
            title="YouTube 원본 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다."
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-extrabold text-slate-600 transition-colors hover:bg-slate-50 disabled:text-slate-300"
          />
          <a href={videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-extrabold text-slate-600 hover:bg-slate-50" title="YouTube 원본 영상 열기" aria-label={`${videoTitle} YouTube 원본 보기`}>
            <Play className="h-3.5 w-3.5" /> 원본 보기 <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  );
}
