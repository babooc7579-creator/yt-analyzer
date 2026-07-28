import { hasCopyableUrlValue } from './copyUrlButtonProps';

export const getScrapbookHeaderActionsViewProps = ({
  copiedPrompt,
  onCopyPrompt,
  promptCopyError,
  savedVideoCount,
  variant = 'scrapbook',
  videoUrlList,
}) => {
  const hasSavedVideos = savedVideoCount > 0;
  const hasVideoUrlList = hasCopyableUrlValue(videoUrlList);
  const isProductionMode = variant === 'production';
  const itemLabel = isProductionMode ? '제작 후보 영상' : '보관 소재';
  const promptButtonLabel = promptCopyError
    ? '복사 실패 - 다시 시도'
    : copiedPrompt
      ? '복사 완료! AI에게 붙여넣으세요'
      : 'AI 요청문 복사';
  const promptIconName = promptCopyError ? 'alert' : copiedPrompt ? 'check' : 'lightbulb';
  const promptHelpText = promptCopyError
    ? '브라우저가 클립보드 복사를 막았습니다. 다시 누르거나 브라우저 권한을 확인해 주세요.'
    : 'URL 목록은 제목과 원본 링크만, AI 프롬프트는 요청문 형태로 복사합니다. 둘 다 API를 새로 호출하지 않습니다.';

  return {
    copyUrlButtonProps: {
      url: videoUrlList,
      label: 'URL 목록 복사',
      copiedLabel: '목록 복사 완료',
      disabled: !hasSavedVideos || !hasVideoUrlList,
      ariaLabel: `${itemLabel} ${savedVideoCount}개 URL 목록 복사`,
      title: hasSavedVideos
        ? `${itemLabel} 제목과 YouTube URL 목록을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다.`
        : `${itemLabel}이 있어야 URL 목록을 복사할 수 있습니다`,
      className: `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm transition-all ${hasSavedVideos && hasVideoUrlList ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50' : 'cursor-not-allowed bg-slate-100 text-slate-400'}`,
      iconClassName: 'w-4 h-4',
    },
    promptButtonProps: {
      onClick: onCopyPrompt,
      disabled: !hasSavedVideos,
      className: `flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${hasSavedVideos ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:shadow-md hover:scale-105' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`,
      title: hasSavedVideos
        ? `AI API를 호출하지 않고 ${itemLabel} 기반 요청문만 클립보드에 복사`
        : `${itemLabel}이 있어야 복사할 수 있습니다`,
      'aria-label': `${itemLabel} ${savedVideoCount}개: ${promptButtonLabel}`,
      type: 'button',
    },
    promptButtonLabel,
    promptHelpText,
    promptIconName,
  };
};
