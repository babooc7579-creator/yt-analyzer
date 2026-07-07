import { describe, expect, it, vi } from 'vitest';

import { getVideoListRowMetaActionsViewProps } from './videoListRowMetaActionsProps';

describe('videoListRowMetaActionsProps utils', () => {
  const video = {
    videoId: 'video1',
    title: 'Original title',
    duration: '00:58',
    isShorts: true,
    language: 'EN',
  };

  it('builds comments and copy URL action props', () => {
    const fetchTopComments = vi.fn();

    const props = getVideoListRowMetaActionsViewProps({
      fetchTopComments,
      video,
      videoTitle: 'Display title',
      videoUrl: 'https://youtube.com/watch?v=video1',
    });

    expect(props.commentsButtonProps).toMatchObject({
      type: 'button',
      className: expect.stringContaining('bg-indigo-50'),
    });
    expect(props.commentsButtonProps.title).toContain('YouTube API');
    expect(props.commentsButtonProps['aria-label']).toContain('YouTube API');
    expect(props.copyUrlButtonProps).toMatchObject({
      className: expect.stringContaining('bg-slate-50'),
      url: 'https://youtube.com/watch?v=video1',
    });
    expect(props.copyUrlButtonProps.label).not.toBe('');
    expect(props.copyUrlButtonProps.copiedLabel).not.toBe('');
  });

  it('connects the comments button to the current video without calling it eagerly', () => {
    const fetchTopComments = vi.fn();

    const props = getVideoListRowMetaActionsViewProps({
      fetchTopComments,
      video,
      videoTitle: 'Display title',
      videoUrl: 'https://youtube.com/watch?v=video1',
    });

    expect(fetchTopComments).not.toHaveBeenCalled();

    props.commentsButtonProps.onClick();

    expect(fetchTopComments).toHaveBeenCalledWith('video1', 'Original title');
  });

  it('builds duration badges for shorts and long-form videos', () => {
    expect(getVideoListRowMetaActionsViewProps({
      fetchTopComments: () => {},
      video,
      videoTitle: 'Display title',
      videoUrl: '',
    }).durationBadge).toEqual({
      isShorts: true,
      text: 'Shorts (00:58)',
    });

    expect(getVideoListRowMetaActionsViewProps({
      fetchTopComments: () => {},
      video: { ...video, isShorts: false, duration: '08:30' },
      videoTitle: 'Display title',
      videoUrl: '',
    }).durationBadge).toEqual({
      isShorts: false,
      text: '08:30',
    });
  });

  it('maps known language labels and keeps an unknown-language fallback', () => {
    expect(getVideoListRowMetaActionsViewProps({
      fetchTopComments: () => {},
      video,
      videoTitle: 'Display title',
      videoUrl: '',
    }).languageLabel).toBe('EN');

    expect(getVideoListRowMetaActionsViewProps({
      fetchTopComments: () => {},
      video: { ...video, language: 'UNKNOWN' },
      videoTitle: 'Display title',
      videoUrl: '',
    }).languageLabel).not.toBe('');
  });
});
