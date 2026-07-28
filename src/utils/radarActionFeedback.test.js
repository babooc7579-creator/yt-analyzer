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
    expect(feedback.navigationIntent).toEqual({
      searchQuery: 'Strong idea',
      source: 'today-radar',
      targetVideoId: '',
    });
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
    expect(feedback.message).toContain('온라인 저장소(Azure DB)에 저장했습니다');
    expect(feedback.message).toContain('다음 후보가 자동으로 표시됩니다');
    expect(feedback.message).toContain('처리 기록에서 레이더로 되돌릴 수 있습니다');
    expect(feedback.actionLabel).toBe('처리 기록 보기');
    expect(feedback.destination).toBe('decisions');
  });

  it('keeps the promoted video id in the production navigation intent', () => {
    const feedback = getRadarProductionSuccessFeedback({
      videoId: 'video-1',
      title: '오늘 만들 영상',
    });

    expect(feedback.navigationIntent).toEqual({
      searchQuery: '오늘 만들 영상',
      source: 'today-radar',
      targetVideoId: 'video-1',
    });
  });

  it('keeps a scrapbook-only item in the radar decision queue', () => {
    const saved = getRadarScrapbookSuccessFeedback({ video: { title: 'Reference' } });
    const removed = getRadarScrapbookSuccessFeedback({ removed: true, video: { title: 'Reference' } });

    expect(saved.destination).toBe('scrapbook');
    expect(saved.message).toContain('레이더 후보는 유지');
    expect(saved.message).toContain('판단을 마저 선택하세요');
    expect(removed.destination).toBe('');
    expect(removed.message).toContain('온라인 스크랩북(Azure DB)에서 해제');
  });
});
