import { Bookmark, Rocket } from 'lucide-react';

import ScrapbookHeaderActions from './ScrapbookHeaderActions';

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
    ? '제작 후보로 지정한 영상과 발견함 링크를 제작 흐름으로 정리합니다. 메모와 업로드 일정은 Cloud 판단 기록에 저장됩니다.'
    : '별표로 모아둔 소재 보관함입니다. Cloud 기준으로 보관하고, 연결 실패 시에만 브라우저 임시 기록을 안내합니다.';
  const iconClassName = isProductionMode
    ? 'w-6 h-6 text-indigo-600'
    : 'w-6 h-6 text-yellow-500 fill-yellow-500';
  const headerActionsProps = {
    copiedPrompt,
    onCopyPrompt,
    promptCopyError,
    savedVideoCount,
    videoUrlList,
  };

  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <HeaderIcon className={iconClassName} /> {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <ScrapbookHeaderActions {...headerActionsProps} />
    </div>
  );
}
