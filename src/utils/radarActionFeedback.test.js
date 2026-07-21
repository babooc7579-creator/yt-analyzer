import { describe, expect, it } from 'vitest';

import { VIDEO_STATUS } from '../constants/status';
import {
  getRadarProductionSuccessFeedback,
  getRadarScrapbookSuccessFeedback,
  getRadarStatusSuccessFeedback,
} from './radarActionFeedback';

describe('radarActionFeedback', () => {
  it('connects a production save to the production workspace', () => {
    const feedback = getRadarProductionSuccessFeedback({ title: 'Strong idea' });

    expect(feedback.title).toBe('제작 후보로 저장했습니다');
    expect(feedback.message).toContain('Strong idea');
    expect(feedback.message).toContain('다음 후보가 자동으로 표시됩니다');
    expect(feedback.destination).toBe('production');
  });

  it.each([
    [VIDEO_STATUS.REVIEWED, '봤음으로 정리했습니다'],
    [VIDEO_STATUS.LEGACY_LATER, '나중에 보기로 정리했습니다'],
    [VIDEO_STATUS.EXCLUDED, '후보에서 제외했습니다'],
  ])('describes a successful Cloud status decision', (status, title) => {
    const feedback = getRadarStatusSuccessFeedback({
      status,
      video: { title: 'Candidate' },
    });

    expect(feedback.title).toBe(title);
    expect(feedback.message).toContain('Cloud에 저장했습니다');
    expect(feedback.message).toContain('다음 후보가 자동으로 표시됩니다');
  });

  it('keeps a scrapbook-only item in the radar decision queue', () => {
    const saved = getRadarScrapbookSuccessFeedback({ video: { title: 'Reference' } });
    const removed = getRadarScrapbookSuccessFeedback({ removed: true, video: { title: 'Reference' } });

    expect(saved.destination).toBe('scrapbook');
    expect(saved.message).toContain('레이더 후보는 유지');
    expect(saved.message).toContain('판단을 마저 선택하세요');
    expect(removed.destination).toBe('');
    expect(removed.message).toContain('스크랩북에서 해제');
  });
});
