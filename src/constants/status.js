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
  [VIDEO_STATUS.REVIEWED]: '봤음',
  [VIDEO_STATUS.WATCH_LATER]: '나중에 보기',
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
  [CHANNEL_STATUS.DISCARDED]: '제외',
};

export const CHANNEL_GRADE_TONES = {
  [CHANNEL_GRADE.S]: 'border-rose-200 bg-rose-50 text-rose-700',
  [CHANNEL_GRADE.A]: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  [CHANNEL_GRADE.B]: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  [CHANNEL_GRADE.C]: 'border-slate-200 bg-slate-50 text-slate-600',
  [CHANNEL_GRADE.UNCLASSIFIED]: 'border-slate-200 bg-white text-slate-500',
};

export const CHANNEL_STATUS_TONES = {
  [CHANNEL_STATUS.ACTIVE]: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  [CHANNEL_STATUS.PAUSED]: 'border-amber-200 bg-amber-50 text-amber-700',
  [CHANNEL_STATUS.DISCARDED]: 'border-slate-200 bg-slate-100 text-slate-500',
};

export const getChannelGrade = (channel = {}) => (
  Object.values(CHANNEL_GRADE).includes(channel.grade) ? channel.grade : CHANNEL_GRADE.UNCLASSIFIED
);

export const getChannelStatus = (channel = {}) => (
  Object.values(CHANNEL_STATUS).includes(channel.status) ? channel.status : CHANNEL_STATUS.ACTIVE
);

export const SCANNABLE_CHANNEL_STATUSES = [
  CHANNEL_STATUS.ACTIVE,
];

export const isChannelScannable = (channel = {}) => (
  SCANNABLE_CHANNEL_STATUSES.includes(getChannelStatus(channel))
);

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

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);

export const normalizeStatusIds = (statusIds) => (
  Array.isArray(statusIds)
    ? [...new Set(statusIds.map(status => (typeof status === 'string' ? status.trim() : '')).filter(Boolean))]
    : []
);

export const normalizeVideoUserRecord = (record = {}) => {
  const statusIds = hasOwn(record, 'statusIds')
    ? normalizeStatusIds(record.statusIds)
    : normalizeStatusIds(record.status ? [record.status] : []);
  const normalizedStatusIds = record.status && !statusIds.includes(record.status)
    ? [...statusIds, record.status]
    : statusIds;

  return {
    ...record,
    statusIds: normalizedStatusIds,
  };
};

export const normalizeVideoUserRecords = (records = {}) => {
  if (!records || typeof records !== 'object') return {};

  return Object.entries(records).reduce((acc, [videoId, record]) => {
    if (!record || typeof record !== 'object') return acc;
    acc[videoId] = normalizeVideoUserRecord({
      ...record,
      videoId: record.videoId || videoId,
    });
    return acc;
  }, {});
};

export const getVideoStatusIds = (record = {}) => {
  const statusIds = Array.isArray(record.statusIds) ? record.statusIds.filter(Boolean) : [];
  if (record.status && !statusIds.includes(record.status)) return [...statusIds, record.status];
  return statusIds;
};

export const hasVideoStatus = (record, status) => getVideoStatusIds(record).includes(status);

export const hasAnyVideoStatus = (record, statuses) => (
  getVideoStatusIds(record).some(status => statuses.includes(status))
);

export const getProductionStatusFromRecord = (record = {}) => {
  const statusIds = getVideoStatusIds(record);
  if (statusIds.includes(PRODUCTION_STATUS.DONE)) return PRODUCTION_STATUS.DONE;
  if (statusIds.includes(PRODUCTION_STATUS.ACTIVE)) return PRODUCTION_STATUS.ACTIVE;
  if (statusIds.includes(PRODUCTION_STATUS.DECIDED)) return PRODUCTION_STATUS.DECIDED;
  if (statusIds.includes(PRODUCTION_STATUS.REVIEWING)) return PRODUCTION_STATUS.REVIEWING;
  if (statusIds.includes(PRODUCTION_STATUS.ON_HOLD)) return PRODUCTION_STATUS.ON_HOLD;
  return PRODUCTION_STATUS.CANDIDATE;
};

export const withRecordStatus = (record = {}, status, extraUpdates = {}) => {
  const productionStatuses = Object.values(PRODUCTION_STATUS);
  const currentStatusIds = getVideoStatusIds(record);
  const statusIds = productionStatuses.includes(status)
    ? currentStatusIds.filter(currentStatus => !productionStatuses.includes(currentStatus))
    : currentStatusIds;

  return {
    ...record,
    status,
    statusIds: [...new Set([...statusIds, status])],
    ...extraUpdates,
  };
};
