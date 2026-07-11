import { MessageSquareText, Rocket, Trash2 } from 'lucide-react';

import { getScrapbookVideoFooterActionsViewProps } from '../utils/scrapbookVideoFooterActions';
import CopyUrlButton from './CopyUrlButton';

export default function ScrapbookVideoFooterActions({
  onFetchComments,
  isProductionCandidate,
  onPromoteToProduction,
  onRemoveScrap,
  video,
  videoTitle,
  videoUrl,
}) {
  const {
    commentsButtonProps,
    copyUrlButtonProps,
    productionButtonProps,
    productionButtonText,
    removeButtonProps,
  } = getScrapbookVideoFooterActionsViewProps({
    confirmFn: (message) => window.confirm(message),
    isProductionCandidate,
    onFetchComments,
    onPromoteToProduction,
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
      <button {...productionButtonProps}>
        <Rocket className="w-4 h-4" />
        {productionButtonText}
      </button>
      <button {...removeButtonProps}>
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
