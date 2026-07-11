export const getVideoListRowBadgeItems = ({
  isChecked,
  isProductionCandidate,
  isSaved,
  isStrongReaction,
  isTtoTto,
}) => [
  {
    className: 'inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-[10px] font-bold text-yellow-700',
    icon: 'saved',
    isVisible: isSaved,
    label: '스크랩북 보관',
    title: 'Cloud 스크랩북에 보관된 영상입니다. 제작 후보 여부와는 별도입니다.',
  },
  {
    className: 'inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700',
    icon: 'candidate',
    isVisible: isProductionCandidate,
    label: '제작 후보',
    title: 'Cloud 판단 기록에서 제작 후보로 표시된 영상입니다. 제작 후보함에 표시됩니다.',
  },
  {
    className: 'inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700',
    icon: 'checked',
    isVisible: isChecked,
    label: 'AI 요청문 선택',
    title: 'AI 요청문에 포함할 영상으로 화면에서 선택한 상태입니다.',
  },
  {
    className: 'inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm',
    icon: 'tteotteotto',
    isVisible: isStrongReaction || isTtoTto,
    label: '또터또 후보',
    title: '오래된 반응 또는 강한 반응 기준에 맞는 판단 보조 신호입니다. 성공 예측이 아닙니다.',
  },
  {
    className: 'inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold text-orange-700',
    icon: 'strong',
    isVisible: isStrongReaction,
    label: '강한 반응',
    title: '조회수 대비 좋아요 반응이 강한 저장 영상입니다.',
  },
];
