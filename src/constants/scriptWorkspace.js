export const SCRIPT_WORKFLOW_STATUS = {
  NOT_STARTED: '',
  ANALYSIS: 'analysis',
  OUTLINE: 'outline',
  DRAFT: 'draft',
  REVISION: 'revision',
  FINAL: 'final',
};

export const SCRIPT_WORKFLOW_STATUS_OPTIONS = [
  { value: SCRIPT_WORKFLOW_STATUS.NOT_STARTED, label: '시작 전' },
  { value: SCRIPT_WORKFLOW_STATUS.ANALYSIS, label: '분석 중' },
  { value: SCRIPT_WORKFLOW_STATUS.OUTLINE, label: '구성 중' },
  { value: SCRIPT_WORKFLOW_STATUS.DRAFT, label: '초안 작성' },
  { value: SCRIPT_WORKFLOW_STATUS.REVISION, label: '수정 중' },
  { value: SCRIPT_WORKFLOW_STATUS.FINAL, label: '최종본' },
];

export const SCRIPT_MANUAL_GUIDE_SECTIONS = [
  {
    id: 'analysis',
    title: '1. 원본 분석',
    description: '무엇이 시청자를 멈추게 했는지와 내가 다르게 만들 지점을 먼저 적습니다.',
    checks: [
      '핵심 소재와 이 영상을 볼 사람의 문제',
      '첫 장면·첫 문장·썸네일이 관심을 끈 이유',
      '댓글이나 조회 반응으로 확인할 포인트',
      '그대로 복제하지 않고 내 경험·관점으로 바꿀 부분',
      '오래된 정보·정책·가격을 다시 확인할 항목',
    ],
  },
  {
    id: 'outline',
    title: '2. 구성안',
    description: '시청자가 끝까지 이해할 수 있도록 장면과 정보 순서를 정합니다.',
    checks: [
      '이 영상이 전달할 한 문장 결론',
      '도입 훅 → 문제 → 핵심 정보·사례 → 전환 → 결론 순서',
      '각 구간에 필요한 화면·자료·예시',
      '불필요한 반복과 이탈할 수 있는 구간',
      '마지막에 시청자가 할 다음 행동',
    ],
  },
  {
    id: 'body',
    title: '3. 대본 본문',
    description: '실제로 말하고 촬영·편집할 수 있는 문장과 화면 지시로 완성합니다.',
    checks: [
      '한 문장을 짧게 쓰고 소리 내어 읽어보기',
      '장면 전환·화면 자막·자료 위치 표시',
      '수치·제품명·정책·출처의 현재 기준 확인',
      '원본 표현과 지나치게 비슷한 문장 제거',
      '제목의 약속이 본문과 결론에서 실제로 충족되는지 확인',
    ],
  },
];

const SCRIPT_WORKFLOW_STATUS_LABELS = Object.fromEntries(
  SCRIPT_WORKFLOW_STATUS_OPTIONS.map((option) => [option.value, option.label]),
);

export const getScriptWorkflowStatusLabel = (status) => (
  SCRIPT_WORKFLOW_STATUS_LABELS[status] || SCRIPT_WORKFLOW_STATUS_LABELS[SCRIPT_WORKFLOW_STATUS.NOT_STARTED]
);
