export const getStoredVideoGuideCards = () => [
  {
    key: 'scan',
    icon: 'scan',
    badgeClassName: 'rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800',
    cardClassName: 'cursor-default rounded-xl border border-emerald-200 bg-emerald-50 p-4',
    iconClassName: 'w-5 h-5 text-emerald-600 mt-0.5',
    titleClassName: 'text-sm font-extrabold text-emerald-800',
    title: '선택 채널 새 영상 수집',
    description:
      '새 데이터가 필요할 때만 실행하세요. YouTube API를 호출할 수 있고, 저장 영상 불러오기와 다른 작업입니다.',
  },
  {
    key: 'load',
    icon: 'load',
    badgeClassName: 'rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-800',
    cardClassName: 'cursor-default rounded-xl border border-blue-200 bg-blue-50 p-4',
    iconClassName: 'w-5 h-5 text-blue-600 mt-0.5',
    titleClassName: 'text-sm font-extrabold text-blue-800',
    title: '저장된 영상 불러오기',
    description:
      'Cloud DB에 이미 저장된 영상만 조회합니다. YouTube API를 새로 호출하지 않습니다.',
  },
];
