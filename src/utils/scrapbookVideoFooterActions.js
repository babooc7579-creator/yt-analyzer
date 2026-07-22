import { getCommentApiButtonProps } from './commentApiButtonProps';

const getSafeVideo = (video) => (
  video && typeof video === 'object' ? video : {}
);

const getSafeVideoTitle = ({ video, videoTitle }) => (
  videoTitle || getSafeVideo(video).title || '이 영상'
);

export const getScrapbookRemoveConfirmMessage = ({ video, videoTitle } = {}) => {
  const displayTitle = getSafeVideoTitle({ video, videoTitle });

  return `'${displayTitle}' 영상을 Cloud 스크랩북에서 해제할까요?\n\n영상 원본이나 저장된 영상 데이터는 삭제되지 않고, 스크랩북 보관 표시만 해제됩니다.`;
};

export const getScrapbookRemoveButtonProps = ({
  confirmFn,
  onRemoveScrap,
  video,
  videoTitle,
} = {}) => {
  const displayTitle = getSafeVideoTitle({ video, videoTitle });
  const safeVideo = getSafeVideo(video);

  return {
    'aria-label': `${displayTitle} Cloud 스크랩북에서 해제, 원본 영상과 저장 영상 데이터는 삭제하지 않음`,
    className: 'p-1.5 text-slate-400 bg-slate-50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors',
    onClick: () => {
      const message = getScrapbookRemoveConfirmMessage({
        video: safeVideo,
        videoTitle: displayTitle,
      });

      if (confirmFn?.(message)) onRemoveScrap?.(safeVideo);
    },
    title: 'Cloud 스크랩북 보관 표시만 해제합니다. YouTube 원본이나 저장 영상 데이터는 삭제하지 않습니다.',
    type: 'button',
  };
};

export const getScrapbookVideoFooterActionsViewProps = ({
  confirmFn,
  isProductionCandidate = false,
  onFetchComments,
  onPromoteToProduction,
  onRemoveScrap,
  productionSaving = false,
  video,
  videoTitle,
  videoUrl,
} = {}) => {
  const displayTitle = getSafeVideoTitle({ video, videoTitle });
  const safeVideo = getSafeVideo(video);
  const canPromoteToProduction = Boolean(safeVideo.videoId)
    && typeof onPromoteToProduction === 'function'
    && !isProductionCandidate
    && !productionSaving;

  return {
    commentsButtonProps: getCommentApiButtonProps({
      className: 'p-1.5 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors',
      onFetchComments,
      video,
      videoTitle: displayTitle,
    }),
    copyUrlButtonProps: {
      ariaLabel: `${displayTitle} YouTube 원본 URL 복사`,
      className: 'inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1.5 text-[11px] font-bold text-slate-600 transition-colors hover:bg-slate-100 disabled:text-slate-300',
      copiedLabel: '복사 완료',
      label: 'URL 복사',
      title: 'YouTube 원본 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다.',
      url: videoUrl,
    },
    productionButtonProps: {
      'aria-label': isProductionCandidate
        ? `${displayTitle} 이미 Cloud 판단 기록에 제작 후보로 표시되어 제작 후보함에 표시됨`
        : productionSaving
          ? `${displayTitle} 제작 후보 표시를 Cloud에 저장하는 중`
          : `${displayTitle} Cloud 판단 기록에 제작 후보로 표시하고 제작 후보함에서 관리, YouTube API 호출 없음`,
      className: `inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-bold transition-colors ${
        canPromoteToProduction
          ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
          : 'cursor-not-allowed bg-indigo-50 text-indigo-300'
      }`,
      disabled: !canPromoteToProduction,
      onClick: canPromoteToProduction ? () => onPromoteToProduction(safeVideo) : undefined,
      title: productionSaving
        ? '제작 후보 표시를 Cloud에 저장하는 중입니다. 완료될 때까지 기다려 주세요.'
        : isProductionCandidate
        ? '이미 Cloud 판단 기록에 제작 후보로 표시되어 제작 후보함에 표시됩니다. YouTube API를 새로 호출하지 않습니다.'
        : canPromoteToProduction
          ? 'Cloud 판단 기록에 제작 후보로 표시하고 제작 후보함에서 이어서 관리합니다. YouTube API를 새로 호출하지 않습니다.'
          : '제작 후보로 표시할 영상 ID가 없어 Cloud 판단 기록 저장을 실행하지 않습니다.',
      type: 'button',
    },
    productionButtonText: productionSaving
      ? 'Cloud 저장 중'
      : isProductionCandidate
        ? '후보 표시됨'
        : '제작 후보로',
    removeButtonProps: getScrapbookRemoveButtonProps({
      confirmFn,
      onRemoveScrap,
      video,
      videoTitle: displayTitle,
    }),
  };
};

export const getScrapbookProductionFeedbackViewProps = ({
  onOpenProductionCandidates,
  productionResult,
  video,
  videoTitle,
} = {}) => {
  if (!productionResult) return null;

  const displayTitle = getSafeVideoTitle({ video, videoTitle });
  const safeVideo = getSafeVideo(video);

  if (productionResult === 'saved') {
    return {
      actionLabel: '후보함에서 이어서',
      actionTitle: '방금 저장한 제작 후보만 후보함에서 바로 찾습니다. 화면 이동만 하며 YouTube API를 호출하지 않습니다.',
      message: `'${displayTitle}' 영상을 Cloud 제작 후보로 저장했습니다.`,
      onAction: typeof onOpenProductionCandidates === 'function'
        ? () => onOpenProductionCandidates(safeVideo)
        : undefined,
      tone: 'success',
    };
  }

  return {
    message: 'Cloud 제작 후보 저장에 실패했습니다. 제작 후보로 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
    tone: 'danger',
  };
};
