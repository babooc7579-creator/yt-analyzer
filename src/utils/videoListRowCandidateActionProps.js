export const getVideoListRowCandidateActionViewProps = ({
  isProductionCandidate,
  onPromote,
  videoTitle,
}) => ({
  buttonLabel: isProductionCandidate ? '후보함 등록됨' : '제작 후보로',
  buttonProps: {
    className: `inline-flex min-w-[112px] items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold transition-colors ${
      isProductionCandidate
        ? 'cursor-not-allowed bg-indigo-100 text-indigo-400'
        : 'bg-indigo-600 text-white hover:bg-indigo-700'
    }`,
    disabled: isProductionCandidate,
    onClick: onPromote,
    title: isProductionCandidate
      ? '이미 Cloud 판단 기록에 제작 후보로 저장되어 제작 후보함에 표시됩니다.'
      : 'Cloud 판단 기록에 제작 후보로 저장하고 제작 후보함에서 이어서 관리합니다. YouTube API를 새로 호출하지 않습니다.',
    'aria-label': `${videoTitle} ${isProductionCandidate ? '이미 Cloud 판단 기록에 제작 후보로 저장되어 제작 후보함에 표시됨' : 'Cloud 판단 기록에 제작 후보로 저장하고 제작 후보함에서 관리, YouTube API 호출 없음'}`,
    type: 'button',
  },
});
