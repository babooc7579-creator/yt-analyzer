export const REFERENCE_VAULT_SUMMARY_TONES = {
  slate: 'border-slate-300 bg-white/80 text-slate-400',
  yellow: 'border-yellow-200 bg-yellow-50 text-yellow-600',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-600',
  rose: 'border-rose-200 bg-rose-50 text-rose-600',
};

export const REFERENCE_VAULT_HEADER = {
  eyebrow: '현재 작업',
  title: '영상 검토 보드',
  description: '온라인 저장소(Azure DB)에서 불러온 영상 정보를 검토하고, 소재 보관 또는 제작 후보로 표시할 항목을 고릅니다.',
};

export const REFERENCE_VAULT_SUMMARY_CARDS = [
  { key: 'videoCount', label: '불러온 영상' },
  { key: 'visibleScrapCount', label: '보관 표시', tone: 'indigo' },
  { key: 'ttoTtoCount', label: '또터또 후보', tone: 'rose' },
];

export const REFERENCE_VAULT_GUIDE_CARDS = [
  {
    key: 'load-saved-videos',
    title: '1. 수집된 영상 정보 보기',
    description: '이미 DB에 수집된 영상 정보만 불러와서 봅니다. 새 YouTube API 호출은 없습니다.',
    iconName: 'play',
    className: 'border-blue-100 bg-blue-50/80',
    iconClassName: 'text-blue-700',
    titleClassName: 'text-blue-900',
  },
  {
    key: 'save-reference',
    title: '2. 소재 보관',
    description: '나중에 다시 볼 영상은 소재 보관에 넣습니다. 보관한 영상은 소재 보관함에서 모아볼 수 있습니다.',
    iconName: 'bookmark',
    className: 'border-yellow-100 bg-yellow-50/80',
    iconClassName: 'text-yellow-700',
    titleClassName: 'text-yellow-900',
  },
  {
    key: 'promote-production',
    title: '3. 제작 후보로 표시',
    description: '만들 만한 소재는 온라인 저장소(Azure DB)의 판단 기록에 제작 후보로 표시하면 제작 칸반에서 이어서 관리합니다. 새 YouTube API 호출은 없습니다.',
    iconName: 'sparkles',
    className: 'border-indigo-100 bg-indigo-50/80',
    iconClassName: 'text-indigo-700',
    titleClassName: 'text-indigo-900',
  },
];
