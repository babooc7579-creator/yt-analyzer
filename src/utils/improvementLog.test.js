import { describe, expect, it } from 'vitest';

import {
  CREATOR_OS_IMPROVEMENT_AREAS,
  CREATOR_OS_MENU_ROLE_AUDIT,
  IMPROVEMENT_CHECKPOINT_STATUS,
  IMPROVEMENT_LOG_LAST_UPDATED,
} from '../constants/improvementLog';
import { getImprovementLogSummary } from './improvementLog';

describe('improvementLog utils', () => {
  it('keeps the script workspace audit and next decisions visible', () => {
    const scriptWorkspace = CREATOR_OS_IMPROVEMENT_AREAS.find((area) => area.id === 'script-workspace');

    expect(scriptWorkspace).toMatchObject({
      priority: 'P1',
      status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      title: '대본 작업실',
    });
    expect(scriptWorkspace.currentSummary).toContain('videoUserRecords');
    expect(scriptWorkspace.nextAction).toContain('정기 회귀 검수');
    expect(scriptWorkspace.checkpoints).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'script-fields',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      }),
      expect.objectContaining({
        id: 'discovery-link-source',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
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

  it('derives the displayed update date from the newest area review', () => {
    const newestReviewDate = CREATOR_OS_IMPROVEMENT_AREAS
      .map((area) => area.lastReviewedAt)
      .sort()
      .at(-1);

    expect(IMPROVEMENT_LOG_LAST_UPDATED).toBe(newestReviewDate);
    expect(CREATOR_OS_MENU_ROLE_AUDIT.find((item) => item.menu === '키워드 탐색')?.verification)
      .toBe('영상·채널 운영 검수 완료');
  });
});
