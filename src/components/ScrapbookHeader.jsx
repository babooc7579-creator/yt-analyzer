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
    ? '스크랩 영상과 발견함 링크를 제작 흐름으로 정리합니다. 영상 메모와 업로드 예정일은 Cloud 판단 기록에 저장됩니다.'
    : '별표로 모아둔 나만의 영감 보관소입니다. Cloud 기준으로 보관하고, 연결 실패 시에만 브라우저 임시 기록을 안내합니다.';
  const iconClassName = isProductionMode
    ? 'w-6 h-6 text-indigo-600'
    : 'w-6 h-6 text-yellow-500 fill-yellow-500';

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <HeaderIcon className={iconClassName} /> {title}
        </h2>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
      <ScrapbookHeaderActions
        copiedPrompt={copiedPrompt}
        onCopyPrompt={onCopyPrompt}
        promptCopyError={promptCopyError}
        savedVideoCount={savedVideoCount}
        videoUrlList={videoUrlList}
      />
    </div>
  );
}
