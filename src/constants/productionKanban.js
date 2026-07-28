import { PRODUCTION_STATUS, PRODUCTION_STATUS_LABELS } from './status';

export const PRODUCTION_FOCUS_COLUMN_ID = 'today_focus';

export const PRODUCTION_FOCUS_COLUMN = {
  id: PRODUCTION_FOCUS_COLUMN_ID,
  title: '오늘 집중',
  description: '오늘 만들 항목으로 직접 고정한 영상입니다. 날짜가 바뀌어도 자동으로 사라지지 않습니다.',
  emptyTitle: '아직 오늘 집중으로 고정한 영상이 없습니다',
  emptyDescription: '아래 제작 후보 카드에서 오늘 집중을 누르면 이곳에 고정됩니다.',
  tone: 'border-amber-200 bg-amber-50',
};

export const PRODUCTION_KANBAN_COLUMNS = [
  {
    id: PRODUCTION_STATUS.CANDIDATE,
    title: PRODUCTION_STATUS_LABELS[PRODUCTION_STATUS.CANDIDATE],
    description: '만들지 말지 판단할 소재',
    emptyTitle: '대기 중인 제작 후보 없음',
    emptyDescription: '소재 보관함 전체가 자동으로 들어오지는 않습니다. 레이더, 수집 영상, 발견함에서 만들 만한 항목만 제작 후보로 표시하면 여기에 보입니다.',
    tone: 'border-indigo-200 bg-indigo-50',
  },
  {
    id: PRODUCTION_STATUS.ACTIVE,
    title: PRODUCTION_STATUS_LABELS[PRODUCTION_STATUS.ACTIVE],
    description: '지금 제작 중인 소재',
    emptyTitle: '진행 중인 제작 없음',
    emptyDescription: '제작 후보로 고른 항목을 제작 중으로 옮기면 지금 만드는 콘텐츠만 따로 볼 수 있습니다.',
    tone: 'border-emerald-200 bg-emerald-50',
  },
  {
    id: PRODUCTION_STATUS.DONE,
    title: PRODUCTION_STATUS_LABELS[PRODUCTION_STATUS.DONE],
    description: '업로드까지 끝난 소재',
    emptyTitle: '업로드 완료 기록 없음',
    emptyDescription: '제작이 끝난 항목을 업로드 완료로 옮기면 제작 완료 기록으로 남습니다.',
    tone: 'border-slate-200 bg-slate-50',
  },
];
