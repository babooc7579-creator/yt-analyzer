import { describe, expect, it } from 'vitest';

import {
  BACKFILL_MAX_ITEMS,
  getBackfillConfirmMessage,
  getBackfillErrorMessage,
  getBackfillResultMessage,
  getBackfillViewState,
} from './historicalBackfill';

describe('historicalBackfill', () => {
  it('separates not started, resumable, and completed operator states', () => {
    expect(getBackfillViewState()).toMatchObject({
      actionLabel: '전체 과거 영상 수집 시작',
      phase: 'not_started',
    });
    expect(getBackfillViewState({
      inspectionProgressRate: 58.4,
      videosInspectedTotal: 500,
    })).toMatchObject({
      actionLabel: '이어서 과거 영상 수집',
      label: '과거 목록 확인 58.4%',
      phase: 'in_progress',
    });
    expect(getBackfillViewState({
      backfillCompleted: true,
      inspectionProgressRate: 72,
    })).toMatchObject({
      actionLabel: '',
      label: '공개 업로드 목록 끝까지 확인 완료',
      phase: 'completed',
      progress: 100,
    });
  });

  it('explains the capped manual API action before execution', () => {
    const message = getBackfillConfirmMessage('테스트 채널');

    expect(BACKFILL_MAX_ITEMS).toBe(500);
    expect(message).toContain("'테스트 채널'의 공개 업로드 목록을 끝까지 이어서 수집할까요?");
    expect(message).toContain('YouTube API');
    expect(message).toContain('최대 500개');
    expect(message).toContain('신규 저장 수는 확인 수보다 적을 수 있습니다');
    expect(message).toContain('자동 반복');
  });

  it('reports resumable and completed results honestly', () => {
    expect(getBackfillResultMessage({
      inspectedVideos: 100,
      savedVideosThisRun: 30,
      savedVideosTotal: 280,
      estimatedMissingVideos: 120,
      inspectionProgressRate: 50,
    })).toContain('목록 확인 50%');

    expect(getBackfillResultMessage({
      completed: true,
      inspectedVideos: 40,
      savedVideosThisRun: 10,
      savedVideosTotal: 300,
    })).toContain('업로드 목록 확인 100%');
  });

  it('does not disguise a failed Cloud operation as success', () => {
    expect(getBackfillErrorMessage(new Error('quota exceeded'))).toContain('완료로 표시하지 않았습니다');
  });
});
