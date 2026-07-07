import { getVideoProductionCandidateActionCopy } from './videoActionButtonProps';

export const getVideoListRowCandidateActionViewProps = ({
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

  return {
    buttonLabel,
    buttonProps: {
      className: `inline-flex min-w-[112px] items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold transition-colors ${
        isProductionCandidate
          ? 'cursor-not-allowed bg-indigo-100 text-indigo-400'
          : 'bg-indigo-600 text-white hover:bg-indigo-700'
      }`,
      disabled: isProductionCandidate,
      onClick: onPromote,
      title,
      'aria-label': ariaLabel,
      type: 'button',
    },
  };
};
