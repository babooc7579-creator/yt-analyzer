export const DISCOVERY_LINK_STATUS_OPTIONS = [
  { value: 'inbox', label: '수집함' },
  { value: 'reviewing', label: '검토중' },
  { value: 'saved', label: '저장' },
  { value: 'candidate', label: '제작 후보' },
  { value: 'discarded', label: '제외' },
];

export const ALL_DISCOVERY_LINK_STATUS_OPTION = { value: 'all', label: '전체' };

export const DISCOVERY_RIGHTS_STATUS_OPTIONS = [
  { value: 'unknown', label: '미확인' },
  { value: 'needs_check', label: '권리 확인 필요' },
  { value: 'cleared', label: '사용 가능 확인' },
  { value: 'do_not_use', label: '사용 금지' },
];

export const ALL_DISCOVERY_RIGHTS_STATUS_OPTION = { value: 'all', label: '권리 전체' };

export const DISCOVERY_RIGHTS_LABELS = {
  unknown: '권리 미확인',
  needs_check: '권리 확인 필요',
  cleared: '사용 가능 확인',
  do_not_use: '사용 금지',
};

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
    description: '원본과 출처를 확인하기 전에는 제작에 바로 쓰지 마세요.',
    cardClass: 'border-rose-200 bg-rose-50',
    panelClass: 'border-rose-200 bg-white text-rose-700',
  },
  do_not_use: {
    title: '사용 금지 표시',
    description: '제작에 쓰면 위험한 링크입니다. 후보 제외 또는 발견함에서 상태를 수정하세요.',
    cardClass: 'border-red-300 bg-red-50',
    panelClass: 'border-red-200 bg-white text-red-700',
  },
};
