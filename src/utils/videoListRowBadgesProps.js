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
    label: '소재 보관',
    title: '온라인 저장소(Azure DB)의 소재 보관함에 보관된 영상입니다. 제작 후보 여부와는 별도입니다.',
  },
  {
    className: 'inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700',
    icon: 'candidate',
    isVisible: isProductionCandidate,
    label: '제작 후보',
    title: '온라인 저장소(Azure DB)의 판단 기록에서 제작 후보로 표시된 영상입니다. 제작 후보함에 표시됩니다.',
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
    isVisible: isTtoTto,
    label: '또터또 후보',
    title: '게시 후 180일 이상이고 채널 평균보다 1.5배 이상 반응한 수집 영상입니다. 성공 예측이 아닙니다.',
  },
  {
    className: 'inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold text-orange-700',
    icon: 'strong',
    isVisible: isStrongReaction,
    label: '강한 반응',
    title: '대박 지수가 3배 이상인 반응 신호입니다. 또터또 후보와는 별도 기준입니다.',
  },
];
