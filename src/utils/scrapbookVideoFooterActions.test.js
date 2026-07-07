import { describe, expect, it, vi } from 'vitest';

import {
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
    expect(viewProps.removeButtonProps.title).toContain('보관 표시만 해제');
    expect(viewProps.removeButtonProps['aria-label']).toContain('저장 영상 데이터는 삭제하지 않음');
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
    expect(confirmFn.mock.calls[0][0]).toContain('영상 원본이나 저장된 영상 데이터는 삭제되지 않고');
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
