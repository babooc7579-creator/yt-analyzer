import { CalendarDays, Link as LinkIcon, Loader2, Save } from 'lucide-react';

import { SCRIPT_WORKFLOW_STATUS_OPTIONS } from '../constants/scriptWorkspace';
import {
  getScriptWorkspaceChecklist,
} from '../utils/scriptBoard';
import { getProductionVideoDraftSaveButtonProps } from '../utils/productionVideoStatusProps';
import { getYouTubeVideoUrl } from '../utils/urls';
import ProductionVideoExternalActions from './ProductionVideoExternalActions';
import ProductionVideoReadinessChecklist from './ProductionVideoReadinessChecklist';
import ProductionVideoSaveStatus from './ProductionVideoSaveStatus';
import ScriptBoardWritingGuide from './ScriptBoardWritingGuide';
import YouTubeThumbnailImage from './YouTubeThumbnailImage';

export default function ScriptBoardEditor({
  isDirty,
  item,
  onOpenUploadCalendar,
  onSave,
  onUpdateDraft,
  saveState,
}) {
  if (!item) return null;

  const { groupStatus, record = {}, video = {} } = item;
  const videoId = video.videoId;
  const isDiscoveryLink = video.sourceType === 'discovery_link';
  const videoUrl = video.sourceUrl || getYouTubeVideoUrl(videoId);
  const videoTitle = video.title || '제목 없는 영상';
  const isSaving = saveState === 'saving';
  const saveButtonProps = getProductionVideoDraftSaveButtonProps({
    hasSaveTarget: Boolean(videoId) && typeof onSave === 'function',
    isDirty,
    isSaving,
    videoTitle,
  });
  const readiness = getScriptWorkspaceChecklist({ record, video });

  return (
    <article className="min-w-0 border border-slate-700 bg-slate-950/60">
      <div className="grid min-w-0 grid-cols-1 border-b border-slate-800 xl:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.28fr)]">
        {isDiscoveryLink ? (
          <div className="flex aspect-video h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-amber-950 to-slate-950 p-6 text-center text-amber-100">
            <LinkIcon className="h-9 w-9" />
            <p className="text-xs font-extrabold">발견함 링크 원본</p>
            <p className="max-w-sm break-all text-[11px] leading-5 text-amber-100/70">{video.sourceUrl}</p>
          </div>
        ) : (
          <YouTubeThumbnailImage
            src={video.thumbnail}
            videoId={videoId}
            alt={`${videoTitle} 썸네일`}
            className="aspect-video h-full w-full bg-black object-cover"
          />
        )}
        <div className="min-w-0 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            {isDiscoveryLink && <span className="bg-amber-300 px-2 py-1 text-[10px] font-black text-amber-950">발견 링크</span>}
            {item.isFocus && <span className="bg-cyan-400 px-2 py-1 text-[10px] font-black text-slate-950">오늘 집중</span>}
            <span className="border border-indigo-400/40 bg-indigo-500/10 px-2 py-1 text-[10px] font-extrabold text-indigo-200">{item.statusLabel}</span>
            {record.targetPublishDate && (
              <span className="border border-amber-400/30 bg-amber-500/10 px-2 py-1 text-[10px] font-extrabold text-amber-200">
                목표 {record.targetPublishDate}
              </span>
            )}
          </div>
          <h3 className="mt-3 text-lg font-black leading-snug text-white">{videoTitle}</h3>
          <p className="mt-2 text-xs text-slate-400">{video.channel_title || video.channelTitle || (isDiscoveryLink ? '링크 출처 정보 없음' : '채널 정보 없음')}</p>
          <div className="mt-4">
            <ProductionVideoExternalActions
              columnId={groupStatus}
              record={record}
              video={video}
              videoTitle={videoTitle}
              videoUrl={videoUrl}
            />
          </div>
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 p-4 sm:p-5 2xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-4">
          <ScriptBoardWritingGuide />

          <label className="block">
            <span className="text-xs font-extrabold text-slate-200">내가 만들 제목</span>
            <input
              type="text"
              value={record.draftTitle || ''}
              onChange={(event) => onUpdateDraft(videoId, { draftTitle: event.target.value })}
              placeholder="내 채널에 맞게 바꿀 제목 초안"
              className="mt-2 w-full border border-slate-700 bg-slate-900 px-3 py-3 text-sm font-bold text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              title="입력만으로는 온라인 저장소(Azure DB)에 저장되지 않습니다. 아래 ‘변경사항 저장’ 버튼을 눌러야 반영됩니다."
              aria-label={`${videoTitle} 내가 만들 제목 입력`}
            />
          </label>

          <label className="block">
            <span className="text-xs font-extrabold text-slate-200">대본 진행 단계</span>
            <select
              value={record.scriptStatus || ''}
              onChange={(event) => onUpdateDraft(videoId, { scriptStatus: event.target.value })}
              className="mt-2 w-full border border-slate-700 bg-slate-900 px-3 py-3 text-sm font-bold text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              title="현재 대본 작업 단계를 표시합니다. 변경사항 저장 버튼을 눌러야 온라인 저장소(Azure DB)에 반영됩니다."
              aria-label={`${videoTitle} 대본 진행 단계 선택`}
            >
              {SCRIPT_WORKFLOW_STATUS_OPTIONS.map((option) => (
                <option value={option.value} key={option.value || 'not-started'}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-extrabold text-slate-200">1. 영상 분석</span>
            <textarea
              value={record.scriptAnalysis || ''}
              onChange={(event) => onUpdateDraft(videoId, { scriptAnalysis: event.target.value })}
              placeholder={'핵심 소재와 시청자 반응 포인트\n첫 장면·훅이 강한 이유\n내 콘텐츠에서 다르게 만들 부분'}
              rows={6}
              className="mt-2 w-full resize-y border border-slate-700 bg-slate-900 px-3 py-3 text-sm leading-6 text-slate-100 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              title="원본 분석을 입력합니다. 변경사항 저장 버튼을 눌러야 온라인 저장소(Azure DB)에 반영됩니다."
              aria-label={`${videoTitle} 영상 분석 입력`}
            />
          </label>

          <label className="block">
            <span className="text-xs font-extrabold text-slate-200">2. 대본 구성안</span>
            <textarea
              value={record.scriptOutline || ''}
              onChange={(event) => onUpdateDraft(videoId, { scriptOutline: event.target.value })}
              placeholder={'도입: 첫 3초 훅\n전개: 장면과 핵심 정보 순서\n마무리: 결론과 다음 행동'}
              rows={8}
              className="mt-2 w-full resize-y border border-slate-700 bg-slate-900 px-3 py-3 text-sm leading-6 text-slate-100 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              title="대본의 순서와 장면 구성을 입력합니다. 변경사항 저장 버튼을 눌러야 온라인 저장소(Azure DB)에 반영됩니다."
              aria-label={`${videoTitle} 대본 구성안 입력`}
            />
          </label>

          <label className="block">
            <span className="text-xs font-extrabold text-slate-200">3. 대본 본문</span>
            <textarea
              value={record.scriptBody || ''}
              onChange={(event) => onUpdateDraft(videoId, { scriptBody: event.target.value })}
              placeholder="실제로 읽거나 촬영·편집에 사용할 대본을 작성하세요."
              rows={16}
              className="mt-2 w-full resize-y border border-slate-700 bg-slate-900 px-3 py-3 text-sm leading-6 text-slate-100 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              title="대본 본문을 입력합니다. 변경사항 저장 버튼을 눌러야 온라인 저장소(Azure DB)에 반영됩니다."
              aria-label={`${videoTitle} 대본 본문 입력`}
            />
          </label>

          <label className="block border border-slate-800 bg-slate-900/50 p-3">
            <span className="text-xs font-extrabold text-slate-300">기존 통합 작업 메모 <span className="text-slate-500">(기존 자료 보존)</span></span>
            <textarea
              value={record.note || ''}
              onChange={(event) => onUpdateDraft(videoId, { note: event.target.value })}
              placeholder="기존에 작성한 훅·장면·메모가 표시됩니다."
              rows={5}
              className="mt-2 w-full resize-y border border-slate-700 bg-slate-950 px-3 py-3 text-sm leading-6 text-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              title="기존 통합 메모를 그대로 보존합니다. 필요할 때 참고하거나 수정한 뒤 함께 저장할 수 있습니다."
              aria-label={`${videoTitle} 기존 통합 작업 메모 입력`}
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(180px,260px)_minmax(0,1fr)] sm:items-end">
            <label className="block">
              <span className="text-xs font-extrabold text-slate-200">업로드 예정일</span>
              <input
                type="date"
                value={record.targetPublishDate || ''}
                onChange={(event) => onUpdateDraft(videoId, { targetPublishDate: event.target.value })}
                className="mt-2 w-full border border-slate-700 bg-slate-900 px-3 py-3 text-sm font-bold text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                title="저장 후 업로드 캘린더에도 온라인 저장소(Azure DB)의 같은 날짜가 표시됩니다."
                aria-label={`${videoTitle} 업로드 예정일 선택`}
              />
            </label>
            <button
              type="button"
              onClick={onOpenUploadCalendar}
              className="inline-flex items-center justify-center gap-2 border border-amber-400/30 bg-amber-500/10 px-3 py-3 text-xs font-extrabold text-amber-200 hover:bg-amber-500/20"
              title="업로드 캘린더로 이동합니다. 이동만으로 온라인 저장소(Azure DB) 저장이나 YouTube API 호출은 실행되지 않습니다."
              aria-label="업로드 캘린더 열기, 화면 이동이며 온라인 저장소(Azure DB) 데이터 변경 및 YouTube API 호출 없음"
            >
              <CalendarDays className="h-4 w-4" /> 업로드 캘린더 보기
            </button>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => onSave(videoId)}
              disabled={saveButtonProps.disabled}
              className={`inline-flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-black transition-colors sm:w-auto ${
                saveButtonProps.disabled
                  ? 'cursor-not-allowed bg-slate-800 text-slate-500'
                  : 'bg-indigo-500 text-white hover:bg-indigo-400'
              }`}
              title={saveButtonProps.title}
              aria-label={saveButtonProps.ariaLabel}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saveButtonProps.label}
            </button>
            <div className="mt-2">
              <ProductionVideoSaveStatus saveState={saveState} />
            </div>
          </div>
        </div>

        <aside className="min-w-0">
          <ProductionVideoReadinessChecklist {...readiness} />
          <div className="mt-3 border border-slate-700 bg-slate-900/70 p-3 text-xs leading-5 text-slate-400">
            {isDiscoveryLink
              ? '이 화면은 발견함 링크를 원본으로 사용하고, 대본 내용은 기존 제작 기록 영역에 저장합니다. 저장 버튼을 누르기 전 입력은 브라우저에만 머물며 외부 사이트 수집과 YouTube API 호출은 없습니다.'
              : '이 화면은 제작 후보함과 같은 온라인 저장소(Azure DB)의 기록을 편집합니다. 저장 버튼을 누르기 전 입력은 브라우저에만 머물며, YouTube API는 호출하지 않습니다.'}
          </div>
        </aside>
      </div>
    </article>
  );
}
