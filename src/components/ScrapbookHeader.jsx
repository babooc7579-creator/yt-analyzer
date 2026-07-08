import { Bookmark, Rocket } from 'lucide-react';

import { getScrapbookHeaderViewProps } from '../utils/scrapbookHeaderProps';
import ScrapbookHeaderActions from './ScrapbookHeaderActions';

const HEADER_ICONS = {
  bookmark: Bookmark,
  rocket: Rocket,
};

export default function ScrapbookHeader({
  savedVideoCount,
  copiedPrompt,
  promptCopyError,
  onCopyPrompt,
  videoUrlList,
  variant = 'scrapbook',
}) {
  const {
    description,
    iconClassName,
    iconName,
    title,
  } = getScrapbookHeaderViewProps({ variant });
  const HeaderIcon = HEADER_ICONS[iconName];
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
