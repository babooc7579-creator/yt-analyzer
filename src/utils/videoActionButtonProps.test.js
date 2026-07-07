import { describe, expect, it } from 'vitest';

import {
  getVideoProductionCandidateActionCopy,
  getVideoScrapActionCopy,
} from './videoActionButtonProps';

describe('videoActionButtonProps utils', () => {
  it('builds Cloud scrapbook copy without YouTube API confusion', () => {
    const saveProps = getVideoScrapActionCopy({
      isSaved: false,
      videoTitle: 'First idea',
    });
    const removeProps = getVideoScrapActionCopy({
      isSaved: true,
      videoTitle: 'First idea',
    });

    expect(saveProps).toMatchObject({
      buttonLabel: '소재 보관',
      thumbnailLabel: '소재 보관',
    });
    expect(saveProps.title).toContain('Cloud 스크랩북');
    expect(saveProps.title).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(saveProps.ariaLabel).toContain('YouTube API 호출 없음');
    expect(removeProps.buttonLabel).toBe('보관 해제');
    expect(removeProps.thumbnailLabel).toBe('보관됨');
    expect(removeProps.ariaLabel).toContain('보관 해제');
  });

  it('builds production candidate copy as Cloud decision storage', () => {
    const enabledProps = getVideoProductionCandidateActionCopy({
      isProductionCandidate: false,
      videoTitle: 'First idea',
    });
    const disabledProps = getVideoProductionCandidateActionCopy({
      isProductionCandidate: true,
      videoTitle: 'First idea',
    });

    expect(enabledProps.buttonLabel).toBe('제작 후보로');
    expect(enabledProps.title).toContain('Cloud 판단 기록');
    expect(enabledProps.title).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(enabledProps.ariaLabel).toContain('YouTube API 호출 없음');
    expect(disabledProps.buttonLabel).toBe('후보함 등록됨');
    expect(disabledProps.title).toContain('이미 Cloud 판단 기록');
  });

  it('uses a safe title fallback for unnamed videos', () => {
    expect(getVideoScrapActionCopy({
      isSaved: false,
      videoTitle: '',
    }).ariaLabel).toContain('이 영상');

    expect(getVideoProductionCandidateActionCopy({
      isProductionCandidate: false,
      videoTitle: null,
    }).ariaLabel).toContain('이 영상');
  });
});
