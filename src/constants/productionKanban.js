import { PRODUCTION_STATUS, PRODUCTION_STATUS_LABELS } from './status';

export const PRODUCTION_KANBAN_COLUMNS = [
  {
    id: PRODUCTION_STATUS.CANDIDATE,
    title: PRODUCTION_STATUS_LABELS[PRODUCTION_STATUS.CANDIDATE],
    description: '만들지 말지 판단할 소재',
    tone: 'border-indigo-200 bg-indigo-50',
  },
  {
    id: PRODUCTION_STATUS.ACTIVE,
    title: PRODUCTION_STATUS_LABELS[PRODUCTION_STATUS.ACTIVE],
    description: '지금 영상화하는 소재',
    tone: 'border-emerald-200 bg-emerald-50',
  },
  {
    id: PRODUCTION_STATUS.DONE,
    title: PRODUCTION_STATUS_LABELS[PRODUCTION_STATUS.DONE],
    description: '완성 후 기록으로 남긴 소재',
    tone: 'border-slate-200 bg-slate-50',
  },
];
