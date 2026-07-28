import { describe, expect, it } from 'vitest';

import {
  SCRIPT_WORKFLOW_STATUS,
  SCRIPT_WORKFLOW_STATUS_OPTIONS,
  getScriptWorkflowStatusLabel,
} from './scriptWorkspace';

describe('scriptWorkspace constants', () => {
  it('keeps the manual writing workflow explicit and ordered', () => {
    expect(SCRIPT_WORKFLOW_STATUS_OPTIONS.map((option) => option.value)).toEqual([
      SCRIPT_WORKFLOW_STATUS.NOT_STARTED,
      SCRIPT_WORKFLOW_STATUS.ANALYSIS,
      SCRIPT_WORKFLOW_STATUS.OUTLINE,
      SCRIPT_WORKFLOW_STATUS.DRAFT,
      SCRIPT_WORKFLOW_STATUS.REVISION,
      SCRIPT_WORKFLOW_STATUS.FINAL,
    ]);
    expect(getScriptWorkflowStatusLabel(SCRIPT_WORKFLOW_STATUS.REVISION)).toBe('수정 중');
    expect(getScriptWorkflowStatusLabel('unknown')).toBe('시작 전');
  });
});
