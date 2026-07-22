import { useRef, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, MessageSquareText, Rocket, Trash2 } from 'lucide-react';

import {
  getScrapbookProductionFeedbackViewProps,
  getScrapbookVideoFooterActionsViewProps,
} from '../utils/scrapbookVideoFooterActions';
import CopyUrlButton from './CopyUrlButton';

export default function ScrapbookVideoFooterActions({
  onFetchComments,
  isProductionCandidate,
  onOpenProductionCandidates,
  onPromoteToProduction,
  onRemoveScrap,
  video,
  videoTitle,
  videoUrl,
}) {
  const productionLockRef = useRef(false);
  const [productionResult, setProductionResult] = useState('');
  const [productionSaving, setProductionSaving] = useState(false);

  const handlePromoteToProduction = typeof onPromoteToProduction === 'function'
    ? async (targetVideo) => {
      if (productionLockRef.current) return false;

      productionLockRef.current = true;
      setProductionResult('');
      setProductionSaving(true);
      try {
        const didPromote = Boolean(await onPromoteToProduction(targetVideo));
        setProductionResult(didPromote ? 'saved' : 'error');
        return didPromote;
      } catch {
        setProductionResult('error');
        return false;
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
  const productionFeedback = getScrapbookProductionFeedbackViewProps({
    onOpenProductionCandidates,
    productionResult,
    video,
    videoTitle,
  });

  return (
    <div className="flex min-w-0 flex-col items-end gap-2">
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
      {productionFeedback ? (
        <div
          className={`flex max-w-full flex-wrap items-center justify-end gap-2 rounded-lg px-2.5 py-2 text-[11px] font-bold ${
            productionFeedback.tone === 'success'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
          role={productionFeedback.tone === 'danger' ? 'alert' : 'status'}
          aria-live="polite"
        >
          {productionFeedback.tone === 'success' ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          )}
          <span className="min-w-0 break-words">{productionFeedback.message}</span>
          {productionFeedback.onAction ? (
            <button
              type="button"
              onClick={productionFeedback.onAction}
              className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-white px-2 py-1 text-emerald-800 hover:bg-emerald-100"
              title={productionFeedback.actionTitle}
            >
              {productionFeedback.actionLabel}
              <ArrowRight className="h-3 w-3" />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
