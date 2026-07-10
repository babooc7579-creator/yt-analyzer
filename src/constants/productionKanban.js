import { PRODUCTION_STATUS, PRODUCTION_STATUS_LABELS } from './status';

export const PRODUCTION_KANBAN_COLUMNS = [
  {
    id: PRODUCTION_STATUS.CANDIDATE,
    title: PRODUCTION_STATUS_LABELS[PRODUCTION_STATUS.CANDIDATE],
    description: '만들지 말지 판단할 소재',
    emptyTitle: '대기 중인 제작 후보 없음',
    emptyDescription: '스크랩북 전체가 자동으로 들어오지는 않습니다. 레이더, 저장 영상, 발견함에서 만들 만한 항목만 제작 후보로 보내면 여기에 쌓입니다.',
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
