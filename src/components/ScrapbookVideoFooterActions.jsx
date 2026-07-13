import { useRef, useState } from 'react';
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
  const productionLockRef = useRef(false);
  const [productionSaving, setProductionSaving] = useState(false);

  const handlePromoteToProduction = typeof onPromoteToProduction === 'function'
    ? async (targetVideo) => {
      if (productionLockRef.current) return false;

      productionLockRef.current = true;
      setProductionSaving(true);
      try {
        return await onPromoteToProduction(targetVideo);
      } finally {
        productionLockRef.current = false;
        setProductionSaving(false);
      }
    }
    : onPromoteToProduction;
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
    onPromoteToProduction: handlePromoteToProduction,
    onRemoveScrap,
    productionSaving,
    video,
    videoTitle,
    videoUrl,
  });

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
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
