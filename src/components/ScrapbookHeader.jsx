import { AlertTriangle, Bookmark, CheckCircle2, Lightbulb, Rocket } from 'lucide-react';
import CopyUrlButton from './CopyUrlButton';

export default function ScrapbookHeader({
  savedVideoCount,
  copiedPrompt,
  promptCopyError,
  onCopyPrompt,
  videoUrlList,
  variant = 'scrapbook',
}) {
  const isProductionMode = variant === 'production';
  const HeaderIcon = isProductionMode ? Rocket : Bookmark;
  const title = isProductionMode ? '제작 후보함' : '영구 보관 스크랩북';
  const description = isProductionMode
    ? '스크랩 영상과 발견함 링크를 제작 흐름으로 정리합니다. 영상 메모와 업로드 예정일은 Cloud 판단 기록에 저장됩니다.'
    : '별표로 모아둔 나만의 영감 보관소입니다. Cloud 기준으로 보관하고, 연결 실패 시에만 브라우저 임시 기록을 안내합니다.';
  const iconClassName = isProductionMode
    ? 'w-6 h-6 text-indigo-600'
    : 'w-6 h-6 text-yellow-500 fill-yellow-500';
  const promptButtonLabel = promptCopyError
    ? '복사 실패 - 다시 시도'
    : copiedPrompt
      ? '복사 완료! AI에게 붙여넣으세요'
      : 'AI 리메이크 프롬프트 복사';
  const PromptButtonIcon = promptCopyError ? AlertTriangle : copiedPrompt ? CheckCircle2 : Lightbulb;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <HeaderIcon className={iconClassName} /> {title}
        </h2>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <CopyUrlButton
            url={videoUrlList}
            label="URL 목록 복사"
            copiedLabel="목록 복사 완료"
            disabled={savedVideoCount === 0 || !videoUrlList}
            ariaLabel={`스크랩 영상 ${savedVideoCount}개 URL 목록 복사`}
            title={savedVideoCount > 0 ? '스크랩 영상 제목과 YouTube URL 목록을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다.' : '스크랩북에 보관한 영상이 있어야 URL 목록을 복사할 수 있습니다'}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm transition-all ${savedVideoCount > 0 && videoUrlList ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50' : 'cursor-not-allowed bg-slate-100 text-slate-400'}`}
            iconClassName="w-4 h-4"
          />
          <button
            onClick={onCopyPrompt}
            disabled={savedVideoCount === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${savedVideoCount > 0 ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:shadow-md hover:scale-105' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            title={savedVideoCount > 0 ? 'AI API를 호출하지 않고 스크랩 영상 기반 요청문만 클립보드에 복사' : '스크랩북에 보관한 영상이 있어야 복사할 수 있습니다'}
            aria-label={`스크랩 영상 ${savedVideoCount}개로 AI 리메이크 프롬프트 복사`}
            type="button"
          >
            <PromptButtonIcon className="w-5 h-5" /> {promptButtonLabel}
          </button>
        </div>
        <p className="max-w-[320px] text-right text-[10px] text-slate-500">
          {promptCopyError ? '브라우저가 클립보드 복사를 막았습니다. 다시 누르거나 브라우저 권한을 확인해 주세요.' : 'URL 목록은 제목과 원본 링크만, AI 프롬프트는 요청문 형태로 복사합니다. 둘 다 API를 새로 호출하지 않습니다.'}
        </p>
      </div>
    </div>
  );
}
