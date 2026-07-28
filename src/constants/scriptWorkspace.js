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

const SCRIPT_WORKFLOW_STATUS_LABELS = Object.fromEntries(
  SCRIPT_WORKFLOW_STATUS_OPTIONS.map((option) => [option.value, option.label]),
);

export const getScriptWorkflowStatusLabel = (status) => (
  SCRIPT_WORKFLOW_STATUS_LABELS[status] || SCRIPT_WORKFLOW_STATUS_LABELS[SCRIPT_WORKFLOW_STATUS.NOT_STARTED]
);
