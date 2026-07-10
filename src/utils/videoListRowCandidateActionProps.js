import { getVideoProductionCandidateActionCopy } from './videoActionButtonProps';

export const getVideoListRowCandidateActionViewProps = ({
  disabled,
  isProductionCandidate,
  onPromote,
  videoTitle,
}) => {
  const {
    ariaLabel,
    buttonLabel,
    title,
  } = getVideoProductionCandidateActionCopy({
    isProductionCandidate,
    videoTitle,
  });
  const isDisabled = Boolean(disabled) || isProductionCandidate;

  return {
    buttonLabel,
    buttonProps: {
      className: `inline-flex min-w-[112px] items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold transition-colors ${
        isDisabled
          ? 'cursor-not-allowed bg-indigo-100 text-indigo-400'
          : 'bg-indigo-600 text-white hover:bg-indigo-700'
      }`,
      disabled: isDisabled,
      onClick: onPromote,
      title: isDisabled && !isProductionCandidate
        ? '제작 후보로 표시할 영상 ID가 없어 Cloud 판단 기록 저장을 실행하지 않습니다.'
        : title,
      'aria-label': ariaLabel,
      type: 'button',
    },
  };
};
