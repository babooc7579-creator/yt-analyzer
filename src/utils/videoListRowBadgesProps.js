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
    label: '소재 보관됨',
  },
  {
    className: 'inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700',
    icon: 'candidate',
    isVisible: isProductionCandidate,
    label: '제작 후보',
  },
  {
    className: 'inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700',
    icon: 'checked',
    isVisible: isChecked,
    label: 'AI 리메이크 선택',
  },
  {
    className: 'inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm',
    icon: 'tteotteotto',
    isVisible: isStrongReaction || isTtoTto,
    label: '또터또 후보',
  },
  {
    className: 'inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold text-orange-700',
    icon: 'strong',
    isVisible: isStrongReaction,
    label: '강한 반응',
  },
];
