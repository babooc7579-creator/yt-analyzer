import { describe, expect, it } from 'vitest';

import {
  CREATOR_OS_IMPROVEMENT_AREAS,
  IMPROVEMENT_CHECKPOINT_STATUS,
} from '../constants/improvementLog';
import { getImprovementLogSummary } from './improvementLog';

describe('improvementLog utils', () => {
  it('keeps the script workspace audit and next decisions visible', () => {
    const scriptWorkspace = CREATOR_OS_IMPROVEMENT_AREAS.find((area) => area.id === 'script-workspace');

    expect(scriptWorkspace).toMatchObject({
      priority: 'P1',
      status: IMPROVEMENT_CHECKPOINT_STATUS.IN_PROGRESS,
      title: '대본 작업실',
    });
    expect(scriptWorkspace.currentSummary).toContain('videoUserRecords');
    expect(scriptWorkspace.nextAction).toContain('백엔드');
    expect(scriptWorkspace.checkpoints).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'script-fields',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DECISION_REQUIRED,
      }),
      expect.objectContaining({
        id: 'ai-assistance',
        status: IMPROVEMENT_CHECKPOINT_STATUS.LATER,
      }),
    ]));
  });

  it('summarizes checkpoint states without mutating the source records', () => {
    const areas = [{
      checkpoints: [
        { status: IMPROVEMENT_CHECKPOINT_STATUS.DONE },
        { status: IMPROVEMENT_CHECKPOINT_STATUS.IN_PROGRESS },
        { status: IMPROVEMENT_CHECKPOINT_STATUS.DECISION_REQUIRED },
      ],
    }];

    expect(getImprovementLogSummary(areas)).toEqual({
      areaCount: 1,
      checkpointCount: 3,
      decisionRequiredCount: 1,
      doneCount: 1,
      inProgressCount: 1,
    });
  });
});
