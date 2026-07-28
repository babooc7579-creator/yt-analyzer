import { describe, expect, it, vi } from 'vitest';

import {
  getScrapbookProductionFeedbackViewProps,
  getScrapbookRemoveButtonProps,
  getScrapbookRemoveConfirmMessage,
  getScrapbookVideoFooterActionsViewProps,
} from './scrapbookVideoFooterActions';

describe('scrapbookVideoFooterActions utils', () => {
  const video = {
    title: 'Saved idea',
    videoId: 'video-1',
  };

  it('builds footer actions that separate local copy, YouTube comments, and Cloud scrapbook removal', () => {
    const viewProps = getScrapbookVideoFooterActionsViewProps({
      onFetchComments: () => 'comments',
      onPromoteToProduction: () => 'production',
      onRemoveScrap: () => 'remove',
      video,
      videoTitle: 'Display title',
      videoUrl: 'https://youtube.com/watch?v=video-1',
    });

    expect(viewProps.copyUrlButtonProps).toMatchObject({
      copiedLabel: '복사 완료',
      label: 'URL 복사',
      url: 'https://youtube.com/watch?v=video-1',
    });
    expect(viewProps.copyUrlButtonProps.title).toContain('YouTube API 호출이나 저장 작업은 없습니다');
    expect(viewProps.commentsButtonProps.title).toContain('YouTube API');
    expect(viewProps.productionButtonText).toBe('제작 후보로');
    expect(viewProps.productionButtonProps.disabled).toBe(false);
    expect(viewProps.productionButtonProps.title).toContain('온라인 저장소(Azure DB)의 판단 기록');
    expect(viewProps.productionButtonProps.title).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(viewProps.removeButtonProps.title).toContain('보관 표시만 해제');
    expect(viewProps.removeButtonProps['aria-label']).toContain('수집 영상 정보는 삭제하지 않음');
  });

  it('promotes a scrapbook video to production candidate only when the Cloud handler is available', () => {
    const onPromoteToProduction = vi.fn();
    const viewProps = getScrapbookVideoFooterActionsViewProps({
      onPromoteToProduction,
      video,
      videoTitle: 'Display title',
    });

    viewProps.productionButtonProps.onClick();

    expect(onPromoteToProduction).toHaveBeenCalledWith(video);

    const missingHandlerProps = getScrapbookVideoFooterActionsViewProps({
      video,
      videoTitle: 'Display title',
    });
    const missingIdProps = getScrapbookVideoFooterActionsViewProps({
      onPromoteToProduction,
      video: { title: 'No id' },
      videoTitle: 'No id',
    });

    expect(missingHandlerProps.productionButtonProps.disabled).toBe(true);
    expect(missingIdProps.productionButtonProps.disabled).toBe(true);
    expect(missingIdProps.productionButtonProps.title).toContain('영상 ID');
  });

  it('marks an already promoted scrapbook video without running another production save action', () => {
    const onPromoteToProduction = vi.fn();
    const viewProps = getScrapbookVideoFooterActionsViewProps({
      isProductionCandidate: true,
      onPromoteToProduction,
      video,
      videoTitle: 'Display title',
    });

    expect(viewProps.productionButtonText).toBe('후보 표시됨');
    expect(viewProps.productionButtonProps.disabled).toBe(true);
    expect(viewProps.productionButtonProps.title).toContain('이미 온라인 저장소(Azure DB)의 판단 기록');
    expect(viewProps.productionButtonProps.onClick).toBeUndefined();
  });

  it('locks the scrapbook production action while Cloud saving is in progress', () => {
    const onPromoteToProduction = vi.fn();
    const viewProps = getScrapbookVideoFooterActionsViewProps({
      onPromoteToProduction,
      productionSaving: true,
      video,
      videoTitle: 'Display title',
    });

    expect(viewProps.productionButtonText).toBe('온라인 저장소(Azure DB) 저장 중');
    expect(viewProps.productionButtonProps.disabled).toBe(true);
    expect(viewProps.productionButtonProps['aria-label']).toContain('온라인 저장소(Azure DB)에 저장하는 중');
    expect(viewProps.productionButtonProps.title).toContain('완료될 때까지');
    expect(viewProps.productionButtonProps.onClick).toBeUndefined();
  });

  it('offers the saved candidate as a direct handoff and keeps failures explicit', () => {
    const onOpenProductionCandidates = vi.fn();
    const savedFeedback = getScrapbookProductionFeedbackViewProps({
      onOpenProductionCandidates,
      productionResult: 'saved',
      video,
      videoTitle: 'Display title',
    });

    expect(savedFeedback).toMatchObject({
      actionLabel: '후보함에서 이어서',
      tone: 'success',
    });
    expect(savedFeedback.message).toContain('온라인 저장소(Azure DB)의 제작 후보로 표시했습니다');
    expect(savedFeedback.actionTitle).toContain('YouTube API를 호출하지 않습니다');

    savedFeedback.onAction();
    expect(onOpenProductionCandidates).toHaveBeenCalledWith(video);

    expect(getScrapbookProductionFeedbackViewProps({
      productionResult: 'error',
      video,
    })).toEqual({
      message: '온라인 저장소(Azure DB)의 제작 후보 표시를 저장하지 못했습니다. 제작 후보로 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
      tone: 'danger',
    });
    expect(getScrapbookProductionFeedbackViewProps({ video })).toBeNull();
  });

  it('confirms before removing a Cloud scrapbook marker', () => {
    const confirmFn = vi.fn(() => true);
    const onRemoveScrap = vi.fn();
    const buttonProps = getScrapbookRemoveButtonProps({
      confirmFn,
      onRemoveScrap,
      video,
      videoTitle: 'Display title',
    });

    buttonProps.onClick();

    expect(confirmFn).toHaveBeenCalledWith(expect.stringContaining('Display title'));
    expect(confirmFn.mock.calls[0][0]).toContain('영상 원본이나 수집된 영상 정보는 삭제되지 않고');
    expect(onRemoveScrap).toHaveBeenCalledWith(video);
  });

  it('does not remove the scrapbook marker when confirm is cancelled', () => {
    const confirmFn = vi.fn(() => false);
    const onRemoveScrap = vi.fn();
    const buttonProps = getScrapbookRemoveButtonProps({
      confirmFn,
      onRemoveScrap,
      video,
      videoTitle: 'Display title',
    });

    buttonProps.onClick();

    expect(confirmFn).toHaveBeenCalledTimes(1);
    expect(onRemoveScrap).not.toHaveBeenCalled();
  });

  it('uses safe title fallbacks in confirm wording', () => {
    expect(getScrapbookRemoveConfirmMessage()).toContain('이 영상');
    expect(getScrapbookRemoveConfirmMessage({ video })).toContain('Saved idea');
  });
});
