import { describe, expect, it } from 'vitest';

import {
  BACKFILL_MAX_ITEMS,
  getBackfillConfirmMessage,
  getBackfillErrorMessage,
  getBackfillResultMessage,
} from './historicalBackfill';

describe('historicalBackfill', () => {
  it('explains the capped manual API action before execution', () => {
    const message = getBackfillConfirmMessage('테스트 채널');

    expect(BACKFILL_MAX_ITEMS).toBe(100);
    expect(message).toContain("'테스트 채널'의 과거 영상을 더 채울까요?");
    expect(message).toContain('YouTube API');
    expect(message).toContain('최대 100개');
    expect(message).toContain('중복 저장하지 않습니다');
    expect(message).toContain('자동 반복');
  });

  it('reports resumable and completed results honestly', () => {
    expect(getBackfillResultMessage({
      inspectedVideos: 100,
      savedVideosThisRun: 30,
      savedVideosTotal: 280,
      estimatedMissingVideos: 120,
    })).toContain('다음 묶음은 사용자가 다시 실행할 때만');

    expect(getBackfillResultMessage({
      completed: true,
      inspectedVideos: 40,
      savedVideosThisRun: 10,
      savedVideosTotal: 300,
    })).toContain('업로드 목록 끝까지 확인');
  });

  it('does not disguise a failed Cloud operation as success', () => {
    expect(getBackfillErrorMessage(new Error('quota exceeded'))).toContain('완료로 표시하지 않았습니다');
  });
});
