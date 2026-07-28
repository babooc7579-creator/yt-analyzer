import { describe, expect, it, vi } from 'vitest';

import {
  getVideoProductionCandidateButtonActionProps,
  getVideoProductionCandidateActionCopy,
  getVideoScrapButtonActionProps,
  getVideoScrapActionCopy,
  getVideoSelectionActionCopy,
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
    expect(saveProps.title).toContain('온라인 저장소(Azure DB)의 소재 보관함');
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
    expect(enabledProps.title).toContain('온라인 저장소(Azure DB)의 판단 기록');
    expect(enabledProps.title).toContain('제작 후보로 표시');
    expect(enabledProps.title).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(enabledProps.ariaLabel).toContain('YouTube API 호출 없음');
    expect(enabledProps.title).not.toContain('제작 후보로 저장');
    expect(disabledProps.buttonLabel).toBe('후보 표시됨');
    expect(disabledProps.title).toContain('이미 온라인 저장소(Azure DB)의 판단 기록');
    expect(disabledProps.title).toContain('제작 후보로 표시');
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

  it('builds AI prompt selection copy without calling an API', () => {
    const checkedProps = getVideoSelectionActionCopy({
      isChecked: true,
      videoTitle: 'First idea',
    });
    const uncheckedProps = getVideoSelectionActionCopy({
      isChecked: false,
      videoTitle: 'First idea',
    });

    expect(checkedProps.ariaLabel).toBe('First idea AI 요청문 포함 선택 해제, API 호출 없음');
    expect(uncheckedProps.ariaLabel).toBe('First idea AI 요청문 포함 선택 추가, API 호출 없음');
    expect(checkedProps.title).toContain('AI API를 호출하지 않고');
  });

  it('guards scrapbook action when video id or handler is missing', () => {
    const onToggleScrap = vi.fn();
    const enabledProps = getVideoScrapButtonActionProps({
      isSaved: false,
      onToggleScrap,
      video: { videoId: 'video-1', title: 'First idea' },
      videoTitle: 'First idea',
    });

    expect(enabledProps.disabled).toBe(false);
    enabledProps.onClick();
    expect(onToggleScrap).toHaveBeenCalledWith({ videoId: 'video-1', title: 'First idea' });

    const missingIdProps = getVideoScrapButtonActionProps({
      onToggleScrap,
      video: { title: 'No ID' },
    });
    const missingHandlerProps = getVideoScrapButtonActionProps({
      video: { videoId: 'video-2' },
    });

    expect(missingIdProps.disabled).toBe(true);
    expect(missingIdProps.title).toBe('보관할 영상 ID가 없어 온라인 저장소(Azure DB)의 소재 보관함 저장을 실행하지 않습니다.');
    expect(missingHandlerProps.disabled).toBe(true);

    missingIdProps.onClick();
    missingHandlerProps.onClick();

    expect(onToggleScrap).toHaveBeenCalledTimes(1);
  });

  it('guards production candidate action when video id or handler is missing', () => {
    const onPromoteToProduction = vi.fn();
    const enabledProps = getVideoProductionCandidateButtonActionProps({
      isProductionCandidate: false,
      onPromoteToProduction,
      video: { videoId: 'video-1', title: 'First idea' },
      videoTitle: 'First idea',
    });

    expect(enabledProps.disabled).toBe(false);
    enabledProps.onClick();
    expect(onPromoteToProduction).toHaveBeenCalledWith({ videoId: 'video-1', title: 'First idea' });

    const alreadyCandidateProps = getVideoProductionCandidateButtonActionProps({
      isProductionCandidate: true,
      onPromoteToProduction,
      video: { videoId: 'video-2' },
    });
    const missingIdProps = getVideoProductionCandidateButtonActionProps({
      isProductionCandidate: false,
      onPromoteToProduction,
      video: { title: 'No ID' },
    });

    expect(alreadyCandidateProps.disabled).toBe(true);
    expect(alreadyCandidateProps.title).toContain('이미 온라인 저장소(Azure DB)의 판단 기록');
    expect(missingIdProps.disabled).toBe(true);
    expect(missingIdProps.title).toBe('제작 후보로 표시할 영상 ID가 없어 온라인 저장소(Azure DB)의 판단 기록 저장을 실행하지 않습니다.');

    alreadyCandidateProps.onClick();
    missingIdProps.onClick();

    expect(onPromoteToProduction).toHaveBeenCalledTimes(1);
  });
});
