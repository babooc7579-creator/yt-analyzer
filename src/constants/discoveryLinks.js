export const DISCOVERY_LINK_STATUS_OPTIONS = [
  { value: 'inbox', label: '받은 링크' },
  { value: 'reviewing', label: '확인 중' },
  { value: 'saved', label: '보관' },
  { value: 'candidate', label: '제작 후보' },
  { value: 'discarded', label: '제외' },
];

export const getDiscoveryLinkStatusLabel = (status) => (
  DISCOVERY_LINK_STATUS_OPTIONS.find((option) => option.value === status)?.label
    || status
    || '미지정'
);

export const getDiscoveryLinkStatusValue = (link) => link?.status || 'inbox';

export const DISCOVERY_PLATFORM_LABELS = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  web: 'Web',
  unknown: 'Unknown',
};

export const getDiscoveryPlatformLabel = (platform) => (
  DISCOVERY_PLATFORM_LABELS[platform] || DISCOVERY_PLATFORM_LABELS.unknown
);

export const getDiscoveryLinkHost = (url, fallback = '링크') => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return fallback;
  }
};

export const getDiscoveryPlatformFromUrl = (url) => {
  const host = getDiscoveryLinkHost(url, '').toLowerCase();

  if (!host) return 'unknown';
  if (host.includes('instagram.com')) return 'instagram';
  if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
  if (host.includes('tiktok.com')) return 'tiktok';
  return 'web';
};

export const getDiscoveryLinkPlatform = (link) => (
  link?.platform || getDiscoveryPlatformFromUrl(link?.url || '')
);

export const ALL_DISCOVERY_LINK_STATUS_OPTION = { value: 'all', label: '전체' };

export const DISCOVERY_RIGHTS_STATUS_OPTIONS = [
  { value: 'unknown', label: '미확인' },
  { value: 'needs_check', label: '권리 확인 필요' },
  { value: 'cleared', label: '사용 가능 확인' },
  { value: 'do_not_use', label: '사용 금지' },
];

export const getDiscoveryRightsStatusLabel = (rightsStatus) => (
  DISCOVERY_RIGHTS_STATUS_OPTIONS.find((option) => option.value === rightsStatus)?.label
    || rightsStatus
    || '미지정'
);

export const getDiscoveryLinkRightsStatusValue = (link) => link?.rightsStatus || 'unknown';

export const ALL_DISCOVERY_RIGHTS_STATUS_OPTION = { value: 'all', label: '권리 전체' };

export const DISCOVERY_RIGHTS_TONES = {
  unknown: {
    card: 'border-slate-200 bg-white',
    badge: 'border border-slate-200 bg-slate-100 text-slate-600',
    compactBadge: 'bg-slate-100 text-slate-600',
  },
  needs_check: {
    card: 'border-rose-200 bg-rose-50/40',
    badge: 'border border-rose-100 bg-rose-50 text-rose-700',
    compactBadge: 'bg-rose-50 text-rose-600',
  },
  cleared: {
    card: 'border-emerald-100 bg-white',
    badge: 'border border-emerald-100 bg-emerald-50 text-emerald-700',
    compactBadge: 'bg-emerald-50 text-emerald-700',
  },
  do_not_use: {
    card: 'border-red-300 bg-red-50/60',
    badge: 'border border-red-200 bg-red-50 text-red-700',
    compactBadge: 'bg-red-50 text-red-700',
  },
};

export const DISCOVERY_RIGHTS_WARNINGS = {
  needs_check: {
    title: '권리 확인 후 사용',
    description: '원본과 출처를 확인하기 전에는 제작에 바로 쓰지 마세요. 후보에는 남길 수 있지만 오늘 제작 순서에서는 먼저 확인해야 합니다.',
    nextAction: '다음 행동: 원본 링크 열기 → 출처 확인 → 사용 가능 확인 또는 제외로 정리',
    cardClass: 'border-rose-200 bg-rose-50',
    panelClass: 'border-rose-200 bg-white text-rose-700',
  },
  do_not_use: {
    title: '사용 금지 표시',
    description: '제작에 쓰면 위험한 링크입니다. 실수로 오늘 제작 후보에 섞이지 않도록 먼저 제외하거나 권리 상태를 다시 확인하세요.',
    nextAction: '다음 행동: 제작 후보에서 제외하거나 발견함에서 권리 상태를 다시 확인',
    cardClass: 'border-red-300 bg-red-50',
    panelClass: 'border-red-200 bg-white text-red-700',
  },
};
