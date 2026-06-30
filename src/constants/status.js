export const VIDEO_STATUS = {
  UNSEEN: 'unseen',
  OPENED: 'opened',
  REVIEWED: 'reviewed',
  WATCH_LATER: 'watch_later',
  LEGACY_LATER: 'later',
  PRODUCTION_CANDIDATE: 'production_candidate',
  REFERENCE_MATERIAL: 'reference_material',
  TITLE_REFERENCE: 'title_reference',
  EXCLUDED: 'excluded',
  USED: 'used',
};

export const PRODUCTION_STATUS = {
  CANDIDATE: 'production_candidate',
  REVIEWING: 'production_reviewing',
  DECIDED: 'production_decided',
  ACTIVE: 'production_active',
  DONE: 'uploaded',
  ON_HOLD: 'production_on_hold',
};

export const CHANNEL_GRADE = {
  S: 'S',
  A: 'A',
  B: 'B',
  C: 'C',
  UNCLASSIFIED: 'unclassified',
};

export const CHANNEL_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  DISCARDED: 'discarded',
};

export const VIDEO_STATUS_LABELS = {
  [VIDEO_STATUS.UNSEEN]: '아직 안 봄',
  [VIDEO_STATUS.OPENED]: '유튜브 열어봄',
  [VIDEO_STATUS.REVIEWED]: '확인함',
  [VIDEO_STATUS.WATCH_LATER]: '다시 보기',
  [VIDEO_STATUS.LEGACY_LATER]: '나중에 보기',
  [VIDEO_STATUS.PRODUCTION_CANDIDATE]: '제작 후보',
  [VIDEO_STATUS.REFERENCE_MATERIAL]: '자료 참고',
  [VIDEO_STATUS.TITLE_REFERENCE]: '제목 참고',
  [VIDEO_STATUS.EXCLUDED]: '제외',
  [VIDEO_STATUS.USED]: '사용함',
};

export const PRODUCTION_STATUS_LABELS = {
  [PRODUCTION_STATUS.CANDIDATE]: '제작 후보',
  [PRODUCTION_STATUS.REVIEWING]: '검토 중',
  [PRODUCTION_STATUS.DECIDED]: '제작 결정',
  [PRODUCTION_STATUS.ACTIVE]: '제작 중',
  [PRODUCTION_STATUS.DONE]: '업로드 완료',
  [PRODUCTION_STATUS.ON_HOLD]: '보류',
};

export const CHANNEL_GRADE_LABELS = {
  [CHANNEL_GRADE.S]: 'S',
  [CHANNEL_GRADE.A]: 'A',
  [CHANNEL_GRADE.B]: 'B',
  [CHANNEL_GRADE.C]: 'C',
  [CHANNEL_GRADE.UNCLASSIFIED]: '미분류',
};

export const CHANNEL_STATUS_LABELS = {
  [CHANNEL_STATUS.ACTIVE]: '활성',
  [CHANNEL_STATUS.PAUSED]: '보류',
  [CHANNEL_STATUS.DISCARDED]: '폐기',
};

export const RADAR_HIDDEN_VIDEO_STATUSES = [
  VIDEO_STATUS.REVIEWED,
  VIDEO_STATUS.LEGACY_LATER,
  VIDEO_STATUS.WATCH_LATER,
  VIDEO_STATUS.PRODUCTION_CANDIDATE,
  PRODUCTION_STATUS.ACTIVE,
  PRODUCTION_STATUS.DONE,
  VIDEO_STATUS.EXCLUDED,
  VIDEO_STATUS.USED,
];
