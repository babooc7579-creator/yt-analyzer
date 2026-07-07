import { MessageSquareText, Trash2 } from 'lucide-react';

import { getScrapbookVideoFooterActionsViewProps } from '../utils/scrapbookVideoFooterActions';
import CopyUrlButton from './CopyUrlButton';

export default function ScrapbookVideoFooterActions({
  onFetchComments,
  onRemoveScrap,
  video,
  videoTitle,
  videoUrl,
}) {
  const {
    commentsButtonProps,
    copyUrlButtonProps,
    removeButtonProps,
  } = getScrapbookVideoFooterActionsViewProps({
    confirmFn: (message) => window.confirm(message),
    onFetchComments,
    onRemoveScrap,
    video,
    videoTitle,
    videoUrl,
  });

  return (
    <div className="flex gap-2">
      <CopyUrlButton {...copyUrlButtonProps} />
      <button {...commentsButtonProps}>
        <MessageSquareText className="w-4 h-4" />
      </button>
      <button {...removeButtonProps}>
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
