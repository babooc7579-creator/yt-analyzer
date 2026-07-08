export const getStoredVideoGuideCards = () => [
  {
    key: 'scan',
    icon: 'scan',
    cardClassName: 'bg-emerald-50 border border-emerald-100 rounded-xl p-4',
    iconClassName: 'w-5 h-5 text-emerald-600 mt-0.5',
    titleClassName: 'text-sm font-extrabold text-emerald-800',
    title: '선택 채널 새 영상 수집',
    description:
      '새 데이터가 필요할 때만 실행하세요. YouTube API를 호출할 수 있고, 저장 영상 불러오기와 다른 작업입니다.',
  },
  {
    key: 'load',
    icon: 'load',
    cardClassName: 'bg-blue-50 border border-blue-100 rounded-xl p-4',
    iconClassName: 'w-5 h-5 text-blue-600 mt-0.5',
    titleClassName: 'text-sm font-extrabold text-blue-800',
    title: '저장된 영상 불러오기',
    description:
      'Cloud DB에 이미 저장된 영상만 조회합니다. YouTube API를 새로 호출하지 않습니다.',
  },
];
